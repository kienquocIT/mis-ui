$(document).ready(function () {
    let msgData = $("#account-update-page");
    let tbl = $('#datatable_account_list');
    let urlEmployeeList = tbl.attr('data-url-employee')
    tbl.DataTableDefault({
        rowIdx: true,
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
        autoWidth: true,
        scrollX: true,
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
        columns: [  // 30,300,240,120,120,120,240,120,240,390 (1920p)
            {
                'render': () => {
                    return ``;
                },
            },
            {
                className: 'wrap-text w-20',
                data: 'name',
                render: (data, type, row) => {
                    let urlEditPage = msgData.attr('data-url').format_url_with_uuid(row.id);
                    return `<a href="${urlEditPage}"><span><b>` + row.name + `</b></span></a>`
                },
            },
            {
                className: 'wrap-text w-10 text-center',
                data: 'account_type',
                render: (data, type, row) => {
                    let clsBadgeCurrent = -1;
                    let list_class_badge = ['badge-soft-danger', 'badge-soft-blue', 'badge-soft-primary', 'badge-soft-secondary']
                    return (row?.['account_type'] || []).map(
                        (item) => {
                            clsBadgeCurrent += 1;
                            return `<span class="w-80 badge ${list_class_badge[clsBadgeCurrent]} mb-1 badge-sm">${item}</span><br>`;
                        }
                    ).join("");
                },
            },
            {
                className: 'wrap-text w-10 text-center',
                data: 'owner',
                render: (data, type, row) => {
                    if (row.owner.fullname) {
                        return `<span class="badge badge-soft-blue badge-outline w-100">` + row.owner.fullname + `</span><br>`
                    }
                    return ``;
                },
            },
            {
                className: 'wrap-text w-10 text-center',
                data: 'revenue_information',
                render: (data, type, row) => {
                    return `<span class="mask-money text-primary" data-init-money="${row?.['revenue_information']?.['revenue_ytd'] ? row?.['revenue_information']?.['revenue_ytd'] : 0}"></span>`;
                },
            },
            {
                className: 'wrap-text w-10 text-center',
                data: '',
                render: (data, type, row) => {
                    return `<span class="badge badge-soft-primary w-80">${row?.['revenue_information']?.['order_number'] ? row?.['revenue_information']?.['order_number'] : 0}</span>`;
                },
            },
            {
                className: 'wrap-text w-10 text-center',
                data: 'revenue_information',
                render: (data, type, row) => {
                    return `<span class="mask-money text-primary" data-init-money="${row?.['revenue_information']?.['revenue_average'] ? row?.['revenue_information']?.['revenue_average'] : 0}"></span>`;
                },
            },
            {
                className: 'wrap-text w-10 text-center',
                data: 'phone',
                render: (data, type, row) => {
                    return `<span>${row?.['phone'] ? row?.['phone'] : ''}</span>`;
                },
            },
            {
                className: 'wrap-text w-10',
                data: 'website',
                render: (data, type, row) => {
                    return `<span>${row?.['website'] ? row['website'] : ''}</span>`;
                },
            },
            {
                className: 'wrap-text w-10',
                data: 'manager',
                render: (data, type, row) => {
                    let element = ''
                    for (let i = 0; i < row.manager.length; i++) {
                        element += `<span class="w-100 badge badge-soft-success badge-outline mb-1">${row.manager[i].full_name}</span>`;
                    }
                    return element;
                },
            },
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