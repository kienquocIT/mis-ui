$(document).ready(function () {
    let tbl = $('#datatable_contact_list');
    let baseUrlDetail = tbl.attr('data-url-detail');
    tbl.DataTableDefault({
        rowIdx: true,
        scrollX: '100vh',
        scrollY: '70vh',
        scrollCollapse: true,
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
                className: 'wrap-text w-5',
                'render': () => {
                    return ``;
                }
            },
            {
                className: 'wrap-text w-10',
                'data': 'code',
                render: (data, type, row) => {
                    const link = baseUrlDetail.replace(0, row?.['id']);
                    return `<a href="${link}"><span class="badge badge-primary">${row?.['code']}</span></a>`
                },
            },
            {
                className: 'wrap-text w-20',
                'data': 'full_name',
                render: (data, type, row) => {
                    let urlDetail = baseUrlDetail.replace("0", row?.['id']);
                    return `<a href="${urlDetail}"><b>${row?.['fullname']}</b></a>`
                }
            }, {
                className: 'wrap-text w-15',
                'data': 'job_title',
                render: (data, type, row) => {
                    return `<span class="text-muted">${row?.['job_title']}</span>`
                }
            }, {
                className: 'wrap-text w-15',
                'data': 'account_name',
                'render': (data, type, row) => {
                    return `<span class="text-muted">${row?.['account_name']?.['name'] ? row['account_name']['name'] : ''}</span>`
                }
            }, {
                className: 'wrap-text w-20',
                'data': 'mobile',
                'render': (data, type, row) => {
                    return `<span>${row?.['mobile'] ? 'Mobile: ' + row?.['mobile'] : ''}</span><br><span>${row?.['phone'] ? 'Phone: ' + row?.['phone'] : ''}</span><br><span>${row?.['email'] ? 'Email: ' + row?.['email'] : ''}</span>`;
                }
            }, {
                className: 'wrap-text w-15',
                'data': 'owner',
                'render': (data, type, row) => {
                    return `<span class="text-blue">${row?.['owner']?.['fullname'] ? row?.['owner']?.['fullname'] : ''}</span>`
                }
            }
        ],
    })
})