$(document).ready(function () {
    const table = $('#table_partnercenter_result_list');
    const $url = $('#app-urls-factory')
    const $transScript = $('#trans-script')
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
                    return `<div class="account-data" data-account-id="${row.id}">${row.name}</div>`
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
                    const value = row?.['revenue_information']?.['revenue_ytd'] ? row?.['revenue_information']?.['revenue_ytd'] : 0
                    return `<span class="mask-money" data-init-money="${value}"></span>`
                }
            },
            {
                targets: 7,
                width: '10%',
                render: (data, type, row, meta) => {
                    const value = row?.['revenue_information']?.['revenue_average'] ? row?.['revenue_information']?.['revenue_average'] : 0
                    return `<span class="mask-money" data-init-money="${value}"></span>`
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
            {
                targets: 10,
                width: '10%',
                render: (data, type, row, meta) => {

                    return `<button class="btn-collapse-opps btn btn-icon btn-rounded mr-1">
                                <span class="icon"><i class="icon-collapse-opps fas fa-caret-right text-secondary"></i></span>
                            </button>`
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
                width: '10%',
                render: (data, type, row, meta) => {
                    const urlContactDetail = $url.data('contact-detail-view-url')
                    const link = urlContactDetail.replace('0', row.id);
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
            <th>Account Manager</th>
            <th>Opps</th>
        `,
        'contact': `
            <th></th>
            <th>Code</th>
            <th>Name</th>
            <th>Job Title</th>
            <th>Contact Owner</th>
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
                        const listViewUrl = $url.data('lists-list-view-url')
                        const listsTitle = $transScript.data('lists')
                        let $breadcrumb = $('ol.breadcrumb');
                        $breadcrumb.find('li').each(function () {
                            $(this).removeClass('active')
                            $(this).removeAttr('aria-current')
                        })
                        $breadcrumb.append(
                            `<li class="breadcrumb-item">
                                <a href="${listViewUrl}">${listsTitle}</a>
                            </li>`
                        ).removeClass('hidden');
                        $breadcrumb.append(
                            `<li class="breadcrumb-item">${data.title}</li>`
                        ).removeClass('hidden');
                        $('#table-row-header').append(HEADERS[data['data_object'].toLowerCase()])
                        table.DataTableDefault({
                            dom: '<t<"bottom"lip>>',
                            reloadCurrency: true,
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

    $(document).on('click', '.btn-collapse-opps', function (e) {
        e.preventDefault();
        console.log('oke');
        let idTbl = UtilControl.generateRandomString(12);

        let trEle = $(this).closest('tr');
        let iconEle = $(this).find('.icon-collapse-opps');

        iconEle.toggleClass('fa-caret-right fa-caret-down');

        if (iconEle.hasClass('fa-caret-right')) {
            trEle.removeClass('bg-grey-light-5');
            iconEle.removeClass('text-dark').addClass('text-secondary');

            let nextRow = trEle.next('.child-workflow-list');

            nextRow.find('.child-workflow-group').slideToggle("fast",function () {
                nextRow.addClass('hidden');
            });

        }

        if (iconEle.hasClass('fa-caret-down')) {
            trEle.addClass('bg-grey-light-5');
            iconEle.removeClass('text-secondary').addClass('text-dark');

            let nextRow = trEle.next('.child-workflow-list');
            if (!nextRow.length) {
                let dtlSub = `<table id="${idTbl}" class="table nowrap w-100 mb-5">
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>Code</th>
                                                <th>Name</th>
                                                <th>Customer</th>
                                                <th>Sale Person</th>
                                                <th>Open Date</th>
                                                <th>Close Date</th>
                                                <th>Stage</th>
                                            </tr>
                                        </thead>
                                        <tbody></tbody>
                                    </table>`
                const oppListUrl = $url.attr("data-opp-list-api-url")
                const accountDataEle = trEle.find('.account-data')
                const accountId = accountDataEle.attr('data-account-id')
                trEle.after(`
                    <tr class="child-workflow-list">
                        <td colspan="100%">
                            <div class="child-workflow-group hidden-simple">${dtlSub}</div>
                        </td>
                    </tr>
                `);
                $.fn.callAjax2({
                    url: oppListUrl,
                    type: 'GET',
                    isLoading: true,
                    data:{
                      'customer_id':  accountId
                    },
                }
                ).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('opportunity_list')) {
                            console.log(data)
                            $('#' + idTbl).DataTableDefault({
                                dom: '<t<"bottom"lip>>',
                                rowIdx: true,
                                authWidth: false,
                                scrollX: true,
                                paging: true,
                                data: data['opportunity_list'],
                                columns: [
                                    {
                                        targets: 0,
                                        className: 'wrap-text w-5',
                                        render: () => {
                                            return ``
                                        }
                                    },
                                    {
                                        targets: 1,
                                        className: 'wrap-text w-10',
                                        render: (data, type, row) => {
                                            const link = $url.attr('data-opp-detail-view-url').format_url_with_uuid(row?.['id'])
                                            return `<a href="${link}"><span class="badge badge-primary">${row?.['code']}</span></a>`
                                        }
                                    },
                                    {
                                        targets: 2,
                                        className: 'wrap-text w-20',
                                        render: (data, type, row) => {
                                            const link = $url.attr('data-opp-detail-view-url').format_url_with_uuid(row?.['id'])
                                            return `<a href="${link}"><span class="fw-bold text-primary">${row?.['title']}</span></a>`
                                        }
                                    },
                                    {
                                        targets: 3,
                                        className: 'wrap-text w-20',
                                        render: (data, type, row) => {
                                            return `<span class="text-muted">${row?.['customer']?.['title']}</span>`
                                        }
                                    },
                                    {
                                        targets: 4,
                                        className: 'wrap-text w-15',
                                        render: (data, type, row) => {
                                            return `<span class="text-blue">${row?.['sale_person']?.['full_name']}</span>`
                                        }
                                    },
                                    {
                                        targets: 5,
                                        className: 'wrap-text w-10',
                                        data: "open_date",
                                        render: (data, type, row) => {
                                            return data !== null && data !== undefined ? $x.fn.displayRelativeTime(data, {
                                                'outputFormat': 'DD-MM-YYYY',
                                                callback: function (data) {
                                                    return `<p>${data?.['relate']}</p><small>${data?.['output']}</small>`;
                                                }
                                            }) : "_";
                                        }
                                    },
                                    {
                                        targets: 6,
                                        className: 'wrap-text w-10',
                                        data: "close_date",
                                        render: (data, type, row) => {
                                            return data !== null && data !== undefined ? $x.fn.displayRelativeTime(data, {
                                                'outputFormat': 'DD-MM-YYYY',
                                                callback: function (data) {
                                                    return `<p>${data?.['relate']}</p><small>${data?.['output']}</small>`;
                                                }
                                            }) : "_";
                                        }
                                    },
                                    {
                                        targets: 7,
                                        className: 'wrap-text w-10',
                                        render: (data, type, row) => {
                                            let stage_current;
                                            stage_current = row?.['stage'].find(function (obj) {
                                                return obj?.['is_current'] === true;
                                            });
                                            return `<span class="${stage_current?.['win_rate'] === 100 ? 'text-gold' : 'text-secondary'}">${stage_current?.['indicator']} (${stage_current?.['win_rate']}%)</span>${stage_current?.['win_rate'] === 100 ? '&nbsp;<i class="bi bi-trophy-fill text-gold"></i>' : ''}`
                                        }
                                    },
                                ],
                            })
                        }
                    }

                    )
                nextRow = trEle.next('.child-workflow-list');
            }

            nextRow.removeClass('hidden')
            nextRow.find('.child-workflow-group').slideToggle("fast");
        }
    });

})
