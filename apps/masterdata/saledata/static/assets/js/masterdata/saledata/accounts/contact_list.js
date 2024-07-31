$(document).ready(function () {
    let tbl = $('#datatable_contact_list');
    let baseUrlDetail = tbl.attr('data-url-detail');
    tbl.DataTableDefault({
        rowIdx: true,
        useDataServer: true,
        ajax: {
            url: tbl.attr('data-url'),
            type: tbl.attr('data-method'),
            dataSrc: function (resp) {
                let data = $.fn.switcherResp(resp);
                if (data && data.hasOwnProperty('contact_list')) return data['contact_list'];
                return [];
            },
        },
        columns: [
            {
                'render': (data, type, row, meta) => {
                    return ``;
                }
            },
            {
                className: 'wrap-text w-10',
                'data': 'code',
                render: (data, type, row) => {
                    const link = baseUrlDetail.replace(0, row.id);
                    return `<a href="${link}"><span class="badge badge-soft-primary w-70">${row?.['code']}</span></a> ${$x.fn.buttonLinkBlank(link)}`
                },
            },
            {
                className: 'wrap-text w-15',
                'data': 'full_name',
                render: (data, type, row, meta) => {
                    let urlDetail = baseUrlDetail.replace("0", row?.['id']);
                    return `<a href="${urlDetail}"><b>${row.fullname}</b></a>`
                }
            }, {
                className: 'wrap-text w-10',
                'data': 'job_title',
                render: (data, type, row, meta) => {
                    return `<span>${row.job_title}</span>`
                }
            }, {
                className: 'wrap-text w-25',
                'data': 'account_name',
                'render': (data, type, row, meta) => {
                    return `<span class="fw-bold">${row?.['account_name']?.['name'] ? row['account_name']['name'] : ''}</span>`
                }
            }, {
                className: 'wrap-text w-10',
                'data': 'mobile',
                'render': (data, type, row, meta) => {
                    return `<span>${row.mobile ? row.mobile : ''}</span>`;
                }
            }, {
                className: 'wrap-text w-15',
                'data': 'email',
                'render': (data, type, row, meta) => {
                    return `<span>${row.email ? row.email : ''}</span>`;
                }
            }, {
                className: 'wrap-text w-15',
                'data': 'owner',
                'render': (data, type, row, meta) => {
                    return `<span class="text-blue">${row.owner.fullname ? row.owner.fullname : ''}</span>`
                }
            }
        ],
    })
})