$(document).ready(function () {
    let tbl = $('#datatable_account_list');
    tbl.DataTableDefault({
        ajax: {
            url: tbl.attr('data-url'),
            type: tbl.attr('data-method'),
            dataSrc: function (resp) {
                let data = $.fn.switcherResp(resp);
                if (data && data.hasOwnProperty('account_list')) return data['account_list'];
                return [];
            }
        },
        columns: [
            {
                'render': (data, type, row, meta) => {
                    let currentId = "chk_sel_" + String(meta.row + 1)
                    return `<span class="form-check mb-0"><input type="checkbox" class="form-check-input check-select" id="${currentId}" data-id=` + row.id + `><label class="form-check-label" for="${currentId}"></label></span>`;
                }
            }, {
                'data': 'name',
                render: (data, type, row, meta) => {
                    let urlEditPage = $('#account-update-page').attr('data-url').format_url_with_uuid(row.id);
                    return `<a href="${urlEditPage}"><span><b>` + row.name + `</b></span></a>`
                }
            }, {
                'data': 'account_type',
                render: (data, type, row, meta) => {
                    let list_class_badge = ['badge-soft-danger', 'badge-soft-blue', 'badge-soft-primary', 'badge-soft-secondary']
                    let element = ''
                    for (let i = 0; i < row.account_type.length; i++) {
                        element += `<span class="badge ` + list_class_badge[i] + ` mt-1 ml-1">` + row.account_type[i] + `</span>`;
                    }
                    return `<div class="row">` + element + `</div>`
                }
            }, {
                'data': 'owner',
                'render': (data, type, row, meta) => {
                    if (row.owner.fullname) {
                        return `<div class="row"><center><span style="width: 100%" class="badge badge-soft-orange">` + row.owner.fullname + `</span></center></div>`
                    } else {
                        return ``
                    }
                }
            }, {
                'data': 'phone',
                'render': (data, type, row, meta) => {
                    return `<span><center>` + row.phone + `</center></span>`
                }
            }, {
                'data': 'website',
                'render': (data, type, row, meta) => {
                    return `<span><center>` + row.website + `</center></span>`
                }
            }, {
                'data': 'manager',
                'render': (data, type, row, meta) => {
                    let element = ''
                    for (let i = 0; i < row.manager.length; i++) {
                        element += `<span class="badge badge-soft-secondary mt-1 ml-1">` + row.manager[i].fullname + `</span>`;
                    }
                    return `<div class="row">` + element + `</div>`
                }
            }, {
                'className': 'action-center',
                'render': (data, type, row, meta) => {
                    // let bt2 = `<center><a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Edit" href="#""><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="edit"></i></span></span></a>`;
                    // let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover del-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="#""><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a></center>`;
                    return '';
                }
            },
        ]

    })

    let tbl_draft = $('#datatable_account_list_draft');
    tbl_draft.DataTableDefault({
        ajax: {
            url: tbl_draft.attr('data-url'),
            type: tbl_draft.attr('data-method'),
            dataSrc: function (resp) {
                let data = $.fn.switcherResp(resp);
                if (data && data.hasOwnProperty('account_list_draft')) return data['account_list_draft'];
                return [];
            },
        },
        columns: [
            {
                'render': (data, type, row, meta) => {
                    let currentId = "chk_sel_" + String(meta.row + 1)
                    return `<span class="form-check mb-0"><input type="checkbox" class="form-check-input check-select" id="${currentId}" data-id=` + row.id + `><label class="form-check-label" for="${currentId}"></label></span>`;
                }
            }, {
                'data': 'full_name',
                render: (data, type, row, meta) => {
                    return `<a href="#"><span><b>` + row.fullname + `</b></span></a>`
                }
            }, {
                'data': 'title',
                render: (data, type, row, meta) => {
                    return `<span>` + row.title + `</span>`
                }
            }, {
                'data': 'owner',
                'render': (data, type, row, meta) => {
                    return `<span>` + row.owner + `</span>`
                }
            }, {
                'data': 'account_name',
                'render': (data, type, row, meta) => {
                    return `<span>` + row.account_name + `</span>`
                }
            }, {
                'data': 'mobie',
                'render': (data, type, row, meta) => {
                    return `<span>` + row.mobile + `</span>`
                }
            }, {
                'data': 'email',
                'render': (data, type, row, meta) => {
                    return `<span>` + row.email + `</span>`
                }
            }, {
                'className': 'action-center',
                'render': (data, type, row, meta) => {
                    // let bt2 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Edit" href=""><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="edit"></i></span></span></a>`;
                    // let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover del-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`;
                    // return bt2 + bt3;
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