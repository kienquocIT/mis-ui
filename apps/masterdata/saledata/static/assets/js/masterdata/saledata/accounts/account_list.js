$(document).ready(function () {
    function loadDefaultData() {
        "use strict";
        $(function () {

            let config = {
                dom: '<"row"<"col-7 mb-3"<"blog-toolbar-left">><"col-5 mb-3"<"blog-toolbar-right"flip>>><"row"<"col-sm-12"t>><"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
                ordering: false,
                columnDefs: [{
                    "searchable": false, "orderable": false, // "targets": [0,1,3,4,5,6,7,8,9]
                }],
                order: [2, 'asc'],
                language: {
                    search: "",
                    searchPlaceholder: "Search",
                    info: "_START_ - _END_ of _TOTAL_",
                    sLengthMenu: "View  _MENU_",
                    paginate: {
                        next: '<i class="ri-arrow-right-s-line"></i>', // or '→'
                        previous: '<i class="ri-arrow-left-s-line"></i>' // or '←'
                    }
                },
                drawCallback: function () {
                    $('.dataTables_paginate > .pagination').addClass('custom-pagination pagination-simple');
                    feather.replace();
                },
                data: [],
                columns: [{
                    'render': (data, type, row, meta) => {
                        let currentId = "chk_sel_" + String(meta.row + 1)
                        return `<span class="form-check mb-0"><input type="checkbox" class="form-check-input check-select" id="${currentId}" data-id=` + row.id + `><label class="form-check-label" for="${currentId}"></label></span>`;
                    }
                }, {
                    'data': 'name', render: (data, type, row, meta) => {
                        return `<a href="/saledata/account/` + row.id + `"><span><b>` + row.name + `</b></span></a>`
                    }
                }, {
                    'data': 'account_type', render: (data, type, row, meta) => {
                        let list_class_badge = ['badge-soft-danger', 'badge-soft-blue', 'badge-soft-primary', 'badge-soft-secondary']
                        let element = ''
                        for (let i = 0; i < row.account_type.length; i++) {
                            element += `<span class="badge ` + list_class_badge[i] + ` mt-1 ml-1">` + row.account_type[i] + `</span>`;
                        }
                        return `<div class="row">` + element + `</div>`
                    }
                }, {
                    'data': 'owner', 'render': (data, type, row, meta) => {
                        if (row.owner.fullname) {
                            return `<div class="row"><center><span style="width: 100%" class="badge badge-soft-orange">` + row.owner.fullname + `</span></center></div>`
                        } else {
                            return ``
                        }
                    }
                }, {
                    'data': 'phone', 'render': (data, type, row, meta) => {
                        return `<span><center>` + row.phone + `</center></span>`
                    }
                }, {
                    'data': 'website', 'render': (data, type, row, meta) => {
                        return `<span><center>` + row.website + `</center></span>`
                    }
                }, {
                    'data': 'manager', 'render': (data, type, row, meta) => {
                        let element = ''
                        for (let i = 0; i < row.manager.length; i++) {
                            element += `<span class="badge badge-soft-secondary mt-1 ml-1">` + row.manager[i].fullname + `</span>`;
                        }
                        return `<div class="row">` + element + `</div>`
                    }
                }, {
                    'className': 'action-center', 'render': (data, type, row, meta) => {
                        // let bt2 = `<center><a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Edit" href="#""><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="edit"></i></span></span></a>`;
                        // let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover del-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="#""><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a></center>`;
                        return '';
                    }
                },]
            }

            function initDataTable(config, id_table) {
                /*DataTable Init*/
                let dtb = $(id_table);
                if (dtb.length > 0) {
                    var targetDt = dtb.DataTable(config);
                    /*Checkbox Add*/
                    $(document).on('click', '.del-button', function () {
                        targetDt.rows('.selected').remove().draw(false);
                        return false;
                    });
                    $("div.blog-toolbar-left").html('<div class="d-xxl-flex d-none align-items-center"> <select class="form-select form-select-sm w-120p"><option selected>Bulk actions</option><option value="1">Edit</option><option value="2">Move to trash</option></select> <button class="btn btn-sm btn-light ms-2">Apply</button></div><div class="d-xxl-flex d-none align-items-center form-group mb-0"> <label class="flex-shrink-0 mb-0 me-2">Sort by:</label> <select class="form-select form-select-sm w-130p"><option selected>Date Created</option><option value="1">Date Edited</option><option value="2">Frequent Contacts</option><option value="3">Recently Added</option> </select></div> <select class="d-flex align-items-center w-130p form-select form-select-sm"><option selected>Export to CSV</option><option value="2">Export to PDF</option><option value="3">Send Message</option><option value="4">Delegate Access</option> </select>');
                    dtb.parent().addClass('table-responsive');
                }
            }


            const table = $('#datatable_account_list')
            $.fn.callAjax(table.attr('data-url'), table.attr('data-method')).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    console.log(data)
                    if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('account_list')) {
                        config['data'] = resp.data.account_list;
                    }
                    initDataTable(config, '#datatable_account_list');
                }
            }, (errs) => {
                initDataTable(config, '#datatable_account_list');
            },)


            let config_draft = {
                dom: '<"row"<"col-7 mb-3"<"blog-toolbar-left">><"col-5 mb-3"<"blog-toolbar-right"flip>>><"row"<"col-sm-12"t>><"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
                ordering: false,
                columnDefs: [{
                    "searchable": false, "orderable": false, // "targets": [0,1,3,4,5,6,7,8,9]
                }],
                order: [2, 'asc'],
                language: {
                    search: "",
                    searchPlaceholder: "Search",
                    info: "_START_ - _END_ of _TOTAL_",
                    sLengthMenu: "View  _MENU_",
                    paginate: {
                        next: '<i class="ri-arrow-right-s-line"></i>', // or '→'
                        previous: '<i class="ri-arrow-left-s-line"></i>' // or '←'
                    }
                },
                drawCallback: function () {
                    $('.dataTables_paginate > .pagination').addClass('custom-pagination pagination-simple');
                    feather.replace();
                },
                data: [],
                columns: [{
                    'render': (data, type, row, meta) => {
                        let currentId = "chk_sel_" + String(meta.row + 1)
                        return `<span class="form-check mb-0"><input type="checkbox" class="form-check-input check-select" id="${currentId}" data-id=` + row.id + `><label class="form-check-label" for="${currentId}"></label></span>`;
                    }
                }, {
                    'data': 'full_name', render: (data, type, row, meta) => {
                        return `<a href="#"><span><b>` + row.fullname + `</b></span></a>`
                    }
                }, {
                    'data': 'title', render: (data, type, row, meta) => {
                        return `<span>` + row.title + `</span>`
                    }
                }, {
                    'data': 'owner', 'render': (data, type, row, meta) => {
                        return `<span>` + row.owner + `</span>`
                    }
                }, {
                    'data': 'account_name', 'render': (data, type, row, meta) => {
                        return `<span>` + row.account_name + `</span>`
                    }
                }, {
                    'data': 'mobie', 'render': (data, type, row, meta) => {
                        return `<span>` + row.mobile + `</span>`
                    }
                }, {
                    'data': 'email', 'render': (data, type, row, meta) => {
                        return `<span>` + row.email + `</span>`
                    }
                }, {
                    'className': 'action-center', 'render': (data, type, row, meta) => {
                        // let bt2 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Edit" href=""><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="edit"></i></span></span></a>`;
                        // let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover del-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`;
                        // return bt2 + bt3;
                    }
                },]
            }

            const table_draft = $('#datatable_account_list_draft')
            $.fn.callAjax(table_draft.attr('data-url'), table.attr('data-method')).then((resp) => {
                let data = $.fn.switcherResp(resp);

                if (data) {
                    if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('account_list_draft')) {
                        config_draft['data'] = resp.data.account_list_draft;

                    }
                    initDataTable(config_draft, '#datatable_account_list_draft');
                }
            }, (errs) => {
                initDataTable(config_draft, '#datatable_account_list_draft');
            },)

        });
    }

    loadDefaultData();

    $("#tab-select-table a").on("click", function () {
        let section = $(this).attr('data-collapse')
        $(".account-list").hide()
        let id_tag = `#` + section
        $(id_tag).show();
    })
})