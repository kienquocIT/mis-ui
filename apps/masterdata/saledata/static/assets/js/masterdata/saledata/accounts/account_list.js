$(document).ready(function () {
    let msgData = $("#account-update-page");
    let tbl = $('#datatable_account_list');
    let urlEmployeeList = tbl.attr('data-url-employee')
    tbl.DataTableDefault({
        rowIdx: true,
        scrollX: true,
        scrollY: '70vh',
        scrollCollapse: true,
        useDataServer: true,
        reloadCurrency: true,
        fixedColumns: {
            leftColumns: 2
        },
        ajax: {
            url: tbl.attr('data-url'),
            type: tbl.attr('data-method'),
            dataSrc: function (resp) {
                let data = $.fn.switcherResp(resp);
                if (data && data.hasOwnProperty('account_list')) return data['account_list'];
            },
        },
        fullToolbar: true,
        // cusFilter: [
        //     {
        //         keyParam: "has_manager_custom",
        //         placeholder: msgData.attr('data-msg-by-group'),
        //         allowClear: true,
        //         keyText: "text",
        //         data: [
        //             {
        //                 'id': 'all',
        //                 'text': msgData.attr('data-msg-of-all'),
        //             },
        //             {
        //                 'id': 'same',
        //                 'text': msgData.attr('data-msg-of-group'),
        //             },
        //             {
        //                 'id': 'staff',
        //                 'text': msgData.attr('data-msg-of-staff'),
        //             },
        //             {
        //                 'id': 'me',
        //                 'text': msgData.attr('data-msg-of-me'),
        //                 selected: true,
        //             },
        //         ],
        //     },
        //     {
        //         dataUrl: urlEmployeeList,
        //         keyResp: 'employee_list',
        //         keyText: 'full_name',
        //         keyParam: "manager__contains",
        //         placeholder: msgData.attr('data-msg-filter-manager'),
        //         multiple: true,
        //     },
        // ],
        // cusTool: [
        //     {
        //         'code': 'draft',
        //         eClick: function (){
        //             console.log($(this));
        //         },
        //     },
        //     {
        //         'code': 'export',
        //         eClick: function (){
        //             console.log($(this));
        //         },
        //     },
        // ],
        columns: [
            {
                className: 'w-5',
                'render': () => {
                    return ``;
                },
            },
            {
                className: 'ellipsis-cell-xs w-5',
                render: (data, type, row) => {
                    const link = msgData.attr('data-url').format_url_with_uuid(row?.['id']);
                    return `<a title="${row?.['code'] || '--'}" href="${link}" class="link-primary underline_hover fw-bold">${row?.['code'] || '--'}</a>`;
                }
            },
            {
                className: 'ellipsis-cell-lg w-15',
                render: (data, type, row) => {
                    let link = msgData.attr('data-url').format_url_with_uuid(row?.['id']);
                    return `<a href="${link}" class="link-primary underline_hover" title="${row?.['name']}">${row?.['name']}</a>`
                },
            },
            {
                className: 'w-5',
                render: (data, type, row) => {
                    let account_type_list = ``
                    for (let i = 0; i < (row?.['account_type'] || []).length; i++) {
                        account_type_list += `<span class="badge badge-soft-primary">${row?.['account_type'][i]}</span><br>`
                    }
                    return `${account_type_list}`
                },
            },
            {
                className: 'w-10',
                render: (data, type, row) => {
                    return `<span class="text-muted">${row?.['revenue_information']?.['order_number'] || 0}</span>`;
                },
            },
            {
                className: 'w-10',
                render: (data, type, row) => {
                    return `<span class="mask-money text-muted" data-init-money="${row?.['revenue_information']?.['revenue_ytd'] || 0}"></span>`;
                },
            },
            {
                className: 'w-10',
                render: (data, type, row) => {
                    return `<span class="mask-money text-muted" data-init-money="${row?.['revenue_information']?.['revenue_average'] || 0}"></span>`;
                },
            },
            {
                className: 'ellipsis-cell-sm w-10',
                render: (data, type, row) => {
                    return WFRTControl.displayEmployeeWithGroup(row?.['owner'], 'fullname');
                }
            },
            {
                className: 'w-10',
                render: (data, type, row) => {
                    let account_manager_list = ``
                    for (let i = 0; i < (row?.['manager'] || []).length; i++) {
                        account_manager_list += `<span>${row?.['manager'][i]?.['full_name']}</span><br>`
                    }
                    return `${account_manager_list}`
                },
            },
            {
                className: 'ellipsis-cell-sm w-10',
                render: (data, type, row) => {
                    return WFRTControl.displayEmployeeWithGroup(row?.['employee_created']);
                }
            },
            {
                className: 'ellipsis-cell-sm w-10',
                'render': (data, type, row) => {
                    return $x.fn.displayRelativeTime(row?.['date_created'], {'outputFormat': 'DD/MM/YYYY'});
                }
            }
        ],
    });

    $("#tab-select-table a").on("click", function () {
        let section = $(this).attr('data-collapse')
        $(".account-list").hide()
        let id_tag = `#` + section
        $(id_tag).show();
    });
});