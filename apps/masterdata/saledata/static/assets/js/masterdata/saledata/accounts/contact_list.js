$(document).ready(function () {
    let tbl = $('#datatable_contact_list');
    let baseUrlDetail = tbl.attr('data-url-detail');
    tbl.DataTableDefault({
        rowIdx: true,
        scrollX: true,
        scrollY: '70vh',
        scrollCollapse: true,
        useDataServer: true,
        fixedColumns: {
            leftColumns: 2
        },
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
                className: 'w-5',
                'render': () => {
                    return ``;
                }
            },
            {
                className: 'w-5',
                render: (data, type, row) => {
                    const link = baseUrlDetail.replace(0, row?.['id']);
                    return `<a href="${link}" class="link-primary underline_hover fw-bold">${row?.['code'] || '--'}</a>`;
                },
            },
            {
                className: 'w-25',
                render: (data, type, row) => {
                    let link = baseUrlDetail.replace("0", row?.['id']);
                    return `<a href="${link}" class="link-primary underline_hover" title="${row?.['fullname']}">${row?.['fullname']}</a>`
                }
            }, {
                className: 'w-15',
                render: (data, type, row) => {
                    return `<span class="text-muted">${row?.['job_title']}</span>`
                }
            }, {
                className: 'ellipsis-cell-lg w-15',
                'render': (data, type, row) => {
                    return `<span class="text-muted">${row?.['account_name']?.['name'] ? row['account_name']['name'] : ''}</span>`
                }
            }, {
                className: 'w-20',
                'render': (data, type, row) => {
                    return `<p>${row?.['mobile'] ? 'Mobile: ' + row?.['mobile'] : ''}</p><p>${row?.['phone'] ? 'Phone: ' + row?.['phone'] : ''}</p><p>${row?.['email'] ? 'Email: ' + row?.['email'] : ''}</p>`;
                }
            }, {
                className: 'w-15',
                'render': (data, type, row) => {
                    return `<span>${row?.['owner']?.['fullname'] ? row?.['owner']?.['fullname'] : ''}</span>`
                }
            }
        ],
    })
})