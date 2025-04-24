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
        cusFilter: [
            {
                keyParam: "has_manager_custom",
                placeholder: msgData.attr('data-msg-by-group'),
                allowClear: true,
                keyText: "text",
                data: [
                    {
                        'id': 'all',
                        'text': msgData.attr('data-msg-of-all'),
                    },
                    {
                        'id': 'same',
                        'text': msgData.attr('data-msg-of-group'),
                    },
                    {
                        'id': 'staff',
                        'text': msgData.attr('data-msg-of-staff'),
                    },
                    {
                        'id': 'me',
                        'text': msgData.attr('data-msg-of-me'),
                        selected: true,
                    },
                ],
            },
            {
                dataUrl: urlEmployeeList,
                keyResp: 'employee_list',
                keyText: 'full_name',
                keyParam: "manager__contains",
                placeholder: msgData.attr('data-msg-filter-manager'),
                multiple: true,
            },
        ],
        cusTool: [
            {
                'code': 'draft',
                eClick: function (){
                    console.log($(this));
                },
            },
            {
                'code': 'export',
                eClick: function (){
                    console.log($(this));
                },
            },
        ],
        columns: [
            {
                className: 'w-5',
                'render': () => {
                    return ``;
                },
            },
            {
                className: 'w-5',
                data: 'name',
                render: (data, type, row) => {
                    const link = msgData.attr('data-url').format_url_with_uuid(row?.['id']);
                    return `<a href="${link}" class="link-primary underline_hover">${row?.['code'] || '--'}</a>`;
                }
            },
            {
                className: 'ellipsis-cell-lg w-15',
                data: 'name',
                render: (data, type, row) => {
                    let link = msgData.attr('data-url').format_url_with_uuid(row?.['id']);
                    return `<a href="${link}" class="link-primary underline_hover fw-bold" title="${row?.['name']}">${row?.['name']}</a>`
                },
            },
            {
                className: 'w-10',
                data: 'account_type',
                render: (data, type, row) => {
                    return (row?.['account_type'] || []).map((item) => {return `<span>${item}</span>`;}).join(", ");
                },
            },
            {
                className: 'w-10',
                data: 'owner',
                render: (data, type, row) => {
                    if (row?.['owner']?.['fullname']) {
                        return `<span>${row?.['owner']?.['fullname']}</span>`
                    }
                    return ``;
                },
            }, {
                className: 'w-20',
                data: 'phone',
                render: (data, type, row) => {
                    return `<p>${row?.['phone'] ? 'Phone: ' + row?.['phone'] : ''}</p><p><a class="text-blue" target="_blank" href="${row?.['website'] ? row['website'] : '#'}">${row?.['website'] ? 'Website: ' + row['website'] : ''}</a></p>`;
                },
            },
            {
                className: 'text-center w-10',
                data: '',
                render: (data, type, row) => {
                    return `<span class="text-muted">${row?.['revenue_information']?.['order_number'] ? row?.['revenue_information']?.['order_number'] : 0}</span>`;
                },
            },
            {
                className: 'w-20',
                data: 'revenue_information',
                render: (data, type, row) => {
                    return row?.['revenue_information']?.['revenue_ytd'] > 0 ? `<span class="mask-money text-muted" data-init-money="${row?.['revenue_information']?.['revenue_ytd'] ? row?.['revenue_information']?.['revenue_ytd'] : 0}"></span>
                            <br>(<span class="mask-money text-muted" data-init-money="${row?.['revenue_information']?.['revenue_average'] ? row?.['revenue_information']?.['revenue_average'] : 0}"></span>)` : '';
                },
            }
        ],
        drawCallback: function () {
            // mask money
            $.fn.initMaskMoney2();
        },
    });

    $("#tab-select-table a").on("click", function () {
        let section = $(this).attr('data-collapse')
        $(".account-list").hide()
        let id_tag = `#` + section
        $(id_tag).show();
    });
});