$(document).ready(function () {
    let tbl = $('#datatable_contact_list');
    tbl.DataTableDefault({
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
                'render': (data, type, row, meta) => {
                    let currentId = "chk_sel_" + String(meta.row + 1)
                    return `<span class="form-check mb-0"><input type="checkbox" class="form-check-input check-select" id="${currentId}" data-id=` + row.id + `><label class="form-check-label" for="${currentId}"></label></span>`;
                }
            }, {
                'data': 'full_name',
                render: (data, type, row, meta) => {
                    return `<a href="/saledata/contact/` + row.id + `"><span><b>` + row.fullname + `</b></span></a>`
                    // return `<a href=""><span><b>` + row.fullname + `</b></span></a>`
                }
            }, {
                'data': 'job_title',
                render: (data, type, row, meta) => {
                    return `<span style="min-width: max-content; width: 100%" class="badge badge-soft-danger">` + row.job_title + `</span>`
                }
            }, {
                'data': 'owner',
                'render': (data, type, row, meta) => {
                    return `<span style="min-width: max-content; width: 100%" class="badge badge-soft-indigo">` + row.owner.fullname + `</span>`
                }
            }, {
                'data': 'account_name',
                'render': (data, type, row, meta) => {
                    if (row.account_name.name) {
                        return `<span>` + row.account_name.name + `</span>`
                    } else {
                        return `<span></span>`
                    }
                }
            }, {
                'data': 'mobile',
                'render': (data, type, row, meta) => {
                    if (row.mobile) {
                        return `<span>` + row.mobile + `</span>`
                    } else {
                        return ``
                    }
                }
            }, {
                'data': 'email',
                'render': (data, type, row, meta) => {
                    if (row.email) {
                        return `<span>` + row.email + `</span>`
                    } else {
                        return ``
                    }
                }
            }, {
                'className': 'action-center',
                'render': (data, type, row, meta) => {
                    // let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover del-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`;
                    return `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Edit" href="/saledata/contact/update/${row.id}"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="edit"></i></span></span></a>`;
                }
            },
        ],
    })

    let tbl_draft = $('#datatable_contact_list_draft');
    if (tbl_draft.attr('data-url')) {
        tbl_draft.DataTableDefault({
            ajax: {
                url: tbl_draft.attr('data-url'),
                type: tbl_draft.attr('data-method'),
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('contact_list_draft')) return data['contact_list_draft'];
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
                    'data': 'job_title',
                    render: (data, type, row, meta) => {
                        return `<span>` + row.job_title + `</span>`
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
                        let bt2 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Edit" href="/sale/crm/contact/draft/update/` + row.id + `"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="edit"></i></span></span></a>`;
                        let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover del-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`;
                        return bt2 + bt3;
                    }
                },
            ]
        });
    }

    $("#tab-select-table a").on("click", function () {
        let section = $(this).attr('data-collapse')
        $(".contact-list").hide()
        let id_tag = `#` + section
        $(id_tag).show();
    })
})