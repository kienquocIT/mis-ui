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
        autoWidth: false,
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
                width: "5%",
                'render': () => {
                    return ``;
                },
            },
            {
                orderable: true,
                width: "20%",
                data: 'name',
                render: (data, type, row) => {
                    let urlEditPage = msgData.attr('data-url').format_url_with_uuid(row.id);
                    return `<a href="${urlEditPage}"><span><b>` + row.name + `</b></span></a>`
                },
            },
            {
                width: "20%",
                data: 'account_type',
                render: (data, type, row) => {
                    let clsBadgeCurrent = -1;
                    let list_class_badge = ['badge-soft-danger', 'badge-soft-blue', 'badge-soft-primary', 'badge-soft-secondary']
                    return (row?.['account_type'] || []).map(
                        (item) => {
                            clsBadgeCurrent += 1;
                            return `<span class="badge ${list_class_badge[clsBadgeCurrent]} mt-1 ml-1">${item}</span>`;
                        }
                    ).join("");
                },
            },
            {
                width: "10%",
                data: 'owner',
                render: (data, type, row) => {
                    if (row.owner.fullname) {
                        return `<div class="row"><span style="width: 100%" class="badge badge-soft-orange">` + row.owner.fullname + `</span></div>`
                    }
                    return ``;
                },
            },
            {
                width: "10%",
                data: 'phone',
                render: (data, type, row) => {
                    return `<span>${row?.phone ? row.phone : ''}</span>`
                },
            },
            {
                width: "10%",
                data: 'website',
                render: (data, type, row) => {
                    return `<span>${row?.['website'] ? row['website'] : ''}</span>`
                },
            },
            {
                width: "25%",
                data: 'manager',
                render: (data, type, row) => {
                    let element = ''
                    for (let i = 0; i < row.manager.length; i++) {
                        element += `<span class="badge badge-soft-success mt-1 ml-1">${row.manager[i].full_name}</span>`;
                    }
                    return element;
                },
            },
        ],
    });

    let tbl_draft = $('#datatable_account_list_draft');
    tbl_draft.DataTableDefault({
        // ajax: {
        //     url: tbl_draft.attr('data-url'),
        //     type: tbl_draft.attr('data-method'),
        //     dataSrc: function (resp) {
        //         let data = $.fn.switcherResp(resp);
        //         if (data && data.hasOwnProperty('account_list_draft')) return data['account_list_draft'];
        //         return [];
        //     },
        // },
        columns: [
            {
                render: (data, type, row, meta) => {
                    let currentId = "chk_sel_" + String(meta.row + 1)
                    return `<span class="form-check mb-0"><input type="checkbox" class="form-check-input check-select" id="${currentId}" data-id=` + row.id + `><label class="form-check-label" for="${currentId}"></label></span>`;
                }
            }, {
                data: 'full_name',
                render: (data, type, row) => {
                    return `<a href="#"><span><b>` + row.fullname + `</b></span></a>`
                }
            }, {
                data: 'title',
                render: (data, type, row) => {
                    return `<span>` + row.title + `</span>`
                }
            }, {
                data: 'owner',
                render: (data, type, row) => {
                    return `<span>` + row.owner + `</span>`
                }
            }, {
                data: 'account_name',
                render: (data, type, row) => {
                    return `<span>` + row.account_name + `</span>`
                }
            }, {
                data: 'mobie',
                render: (data, type, row) => {
                    return `<span>` + row.mobile + `</span>`
                }
            }, {
                data: 'email',
                render: (data, type, row) => {
                    return `<span>` + row.email + `</span>`
                }
            }, {
                className: 'action-center',
                render: () => {
                    // let bt2 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Edit" href=""><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="edit"></i></span></span></a>`;
                    // let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover del-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`;
                    // return bt2 + bt3;
                    return ``
                }
            },
        ]
    })

    $("#tab-select-table a").on("click", function () {
        let section = $(this).attr('data-collapse')
        $(".account-list").hide()
        let id_tag = `#` + section
        $(id_tag).show();
    });
});