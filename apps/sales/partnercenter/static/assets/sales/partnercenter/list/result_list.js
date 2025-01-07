$(document).ready(function () {
    let table = $('#table_partnercenter_result_list');
    let $url = $('#app-urls-factory')
    const COLUMNS = {
        'account': [
            {
                targets: 0,
                width: '1%',
                render: (data, type, row, meta) => {
                    return ``
                }
            },
            {
                targets: 1,
                width: '10%',
                render: (data, type, row, meta) => {
                    const urlAccountDetail = $url.data('account-detail-view-url')
                    const link = urlAccountDetail.replace('0', row.id);
                    const code = row?.['code'] ? row['code'] : '_'
                    return `<a href=${link} class="badge badge-primary w-7">${code}</a> ${$x.fn.buttonLinkBlank(link)}`
                }
            },
            {
                targets: 2,
                width: '15%',
                render: (data, type, row, meta) => {
                    return `${row.name}`
                }
            },
            {
                targets: 3,
                width: '10%',
                render: (data, type, row, meta) => {
                    let clsBadgeCurrent = -1;
                    let list_class_badge = ['badge-soft-danger', 'badge-soft-blue', 'badge-soft-primary', 'badge-soft-secondary']
                    return (row?.['account_type'] || []).map(
                        (item) => {
                            clsBadgeCurrent += 1;
                            return `<span class="badge w-100 ${list_class_badge[clsBadgeCurrent]} mb-1">${item['title']}</span><br>`;
                        }
                    ).join("");
                }
            },
            {
                targets: 4,
                width: '10%',
                render: (data, type, row, meta) => {
                    return `${row.owner.fullname ? row.owner.fullname : 'no data'}`
                }
            },
            {
                targets: 5,
                width: '6%',
                render: (data, type, row, meta) => {
                    return `${row.revenue_information.order_number ? row.revenue_information.order_number : 'no data'}`
                }
            },
            {
                targets: 6,
                width: '10%',
                render: (data, type, row, meta) => {
                    return `${row.revenue_information.revenue_ytd ? row.revenue_information.revenue_ytd : 'no data'}`
                }
            },
            {
                targets: 7,
                width: '10%',
                render: (data, type, row, meta) => {
                    return `${row.revenue_information.revenue_average ? row.revenue_information.revenue_average : 'no data'}`
                }
            },
            {
                targets: 8,
                width: '10%',
                render: (data, type, row, meta) => {
                    let element = ''
                    element += `<div class="w-100">Email: ${row.email ? row.email : 'no data'}</div>`;
                    element += `<div class="w-100">Phone: ${row.phone ? row.phone : 'no data'}</div>`;
                    return element;
                }
            },
            {
                targets: 9,
                width: '10%',
                render: (data, type, row, meta) => {
                    let element = ''
                    for (let i = 0; i < row?.['manager'].length; i++) {
                        element += `<span class="w-100 badge badge-soft-success badge-outline mb-1">${row?.['manager'][i]?.['full_name']}</span>`;
                    }
                    return element;
                }
            },
        ],
        'contact': [
            {
                targets: 0,
                width: '1%',
                render: (data, type, row, meta) => {
                    return ``
                }
            },
            {
                targets: 1,
                width: '4%',
                render: (data, type, row, meta) => {
                    return `${row.code}`
                }
            },
            {
                targets: 2,
                width: '15%',
                render: (data, type, row, meta) => {
                    return `${row.name}`
                }
            },
            {
                targets: 3,
                width: '10%',
                render: (data, type, row, meta) => {
                     return `${row.job_title}`
                }
            },
            {
                targets: 4,
                width: '15%',
                render: (data, type, row, meta) => {
                    return `${row.owner.fullname ? row.owner.fullname : 'no data'}`
                }
            },
            {
                targets: 5,
                width: '10%',
                render: (data, type, row, meta) => {
                    return `${row.phone ? row.phone : 'no data'}`
                }
            },
            {
                targets: 6,
                width: '15%',
                render: (data, type, row, meta) => {
                    return `${row.email ? row.email : 'no data'}`
                }
            },
        ],
    }

    const HEADERS = {
        'account': `
            <th></th>
            <th>Code</th>
            <th>Name</th>
            <th>Account Type</th>
            <th>Account Owner</th>
            <th>No of Order</th>
            <th>Revenue ytd</th>
            <th>Revenue average</th>
            <th>Contact information</th>
            <th>Manager</th>
        `,
        'contact': `
            <th></th>
            <th>Code</th>
            <th>Name</th>
            <th>Job Title</th>
            <th>Owner</th>
            <th>Phone</th>
            <th>Email</th>
        `
    }

    $.fn.callAjax2({
            'url': table.data('url'),
            'method': 'GET',
            isLoading: true
        }
    ).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                    if (data && resp.data.hasOwnProperty('list_result')) {
                        let $breadcrumb = $('ol.breadcrumb');
                        $breadcrumb.find('li').each(function () {
                            $(this).removeClass('active')
                            $(this).removeAttr('aria-current')
                        })
                        $breadcrumb.append(
                            `<li class="breadcrumb-item">${data.title}</li>`
                        ).removeClass('hidden');
                        $('#table-row-header').append(HEADERS[data['data_object'].toLowerCase()])
                        table.DataTableDefault({
                            dom: '<t<"bottom"lip>>',
                            rowIdx: true,
                            authWidth: false,
                            scrollX: true,
                            paging: true,
                            data: data['list_result'],
                            columns: COLUMNS[data['data_object'].toLowerCase()]
                        })
                    }
                }
            }
        )
})
