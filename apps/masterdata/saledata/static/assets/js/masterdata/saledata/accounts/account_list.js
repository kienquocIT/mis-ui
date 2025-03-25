$(document).ready(function () {
    let msgData = $("#account-update-page");
    let tbl = $('#datatable_account_list');
    let urlEmployeeList = tbl.attr('data-url-employee')
    tbl.DataTableDefault({
        rowIdx: true,
        scrollX: '100vw',
        scrollY: '70vh',
        scrollCollapse: true,
        useDataServer: true,
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
                className: 'wrap-text w-5',
                'render': () => {
                    return ``;
                },
            },
            {
                className: 'wrap-text w-10',
                data: 'name',
                render: (data, type, row) => {
                    const link = msgData.attr('data-url').format_url_with_uuid(row?.['id']);
                    return `<a href="${link}"><span class="badge badge-primary">${row?.['code']}</span></a>`
                }
            },
            {
                className: 'wrap-text w-15',
                data: 'name',
                render: (data, type, row) => {
                    let urlEditPage = msgData.attr('data-url').format_url_with_uuid(row?.['id']);
                    return `<a href="${urlEditPage}"><span><b>` + row?.['name'] + `</b></span></a>`
                },
            },
            {
                className: 'wrap-text w-10',
                data: 'account_type',
                render: (data, type, row) => {
                    let clsBadgeCurrent = -1;
                    let list_class_badge = ['badge-soft-danger', 'badge-soft-blue', 'badge-soft-primary', 'badge-soft-secondary']
                    return (row?.['account_type'] || []).map(
                        (item) => {
                            clsBadgeCurrent += 1;
                            return `<span class="badge w-100 ${list_class_badge[clsBadgeCurrent]} mb-1">${item}</span><br>`;
                        }
                    ).join("");
                },
            },
            {
                className: 'wrap-text w-10',
                data: 'owner',
                render: (data, type, row) => {
                    if (row?.['owner']?.['fullname']) {
                        return `<span class="text-blue">` + row?.['owner']?.['fullname'] + `</span><br>`
                    }
                    return ``;
                },
            },
            {
                className: 'wrap-text w-10',
                data: '',
                render: (data, type, row) => {
                    return `<span class="text-muted">${row?.['revenue_information']?.['order_number'] ? row?.['revenue_information']?.['order_number'] : 0}</span>`;
                },
            },
            {
                className: 'wrap-text w-10',
                data: 'revenue_information',
                render: (data, type, row) => {
                    return `<span class="mask-money text-muted" data-init-money="${row?.['revenue_information']?.['revenue_ytd'] ? row?.['revenue_information']?.['revenue_ytd'] : 0}"></span>`;
                },
            },
            {
                className: 'wrap-text w-10',
                data: 'revenue_information',
                render: (data, type, row) => {
                    return `<span class="mask-money text-muted" data-init-money="${row?.['revenue_information']?.['revenue_average'] ? row?.['revenue_information']?.['revenue_average'] : 0}"></span>`;
                },
            },
            {
                className: 'wrap-text w-10',
                data: 'phone',
                render: (data, type, row) => {
                    return `<span>${row?.['phone'] ? 'Phone: ' + row?.['phone'] : ''}</span><br><a class="text-blue" target="_blank" href="${row?.['website'] ? row['website'] : '#'}">${row?.['website'] ? 'Website: ' + row['website'] : ''}</a>`;
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