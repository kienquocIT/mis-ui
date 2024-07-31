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
                'data': 'code',
                render: (data, type, row) => {
                    const link = baseUrlDetail.replace(0, row.id);
                    return `<a href="${link}"><span class="badge badge-soft-primary w-70">${row?.['code']}</span></a> ${$x.fn.buttonLinkBlank(link)}`
                },
            },
            {
                'data': 'full_name',
                render: (data, type, row, meta) => {
                    let urlDetail = baseUrlDetail.replace("0", row?.['id']);
                    return `<a href="${urlDetail}"><span><b>${row.fullname}</b></span></a>`
                }
            }, {
                'data': 'job_title',
                render: (data, type, row, meta) => {
                    return `<span style="min-width: max-content; width: 100%" class="badge badge-soft-danger">${row.job_title}</span>`
                }
            }, {
                'data': 'owner',
                'render': (data, type, row, meta) => {
                    return `<span style="min-width: max-content; width: 100%" class="badge badge-soft-indigo">${row.owner.fullname ? row.owner.fullname : ''}</span>`
                }
            }, {
                'data': 'account_name',
                'render': (data, type, row, meta) => {
                    return `<span>${row?.['account_name']?.['name'] ? row['account_name']['name'] : ''}</span>`
                }
            }, {
                'data': 'mobile',
                'render': (data, type, row, meta) => {
                    return `<span>${row.mobile ? row.mobile : ''}</span>`;
                }
            }, {
                'data': 'email',
                'render': (data, type, row, meta) => {
                    return `<span>${row.email ? row.email : ''}</span>`;
                }
            },
        ],
    })
})