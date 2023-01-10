$(document).ready(function () {
    let first_name = $('#form-firstname').val();
    let last_name = $('#form-lastname').val();
    $('#form-firstname').change(function () {
        first_name = $(this).val();
        $('#form-fullname').val(last_name + ' ' + first_name);
    });

    $('#form-lastname').change(function () {
        last_name = $(this).val();
        $('#form-fullname').val(last_name + ' ' + first_name);
    });

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
        columns: [
            {
                'data': 'code', 'render': (data, type, row, meta) => {
                    return `<span class="badge badge-soft-primary">` + row.code + `</span>`
                }
            }, {
                'data': 'title', 'render': (data, type, row, meta) => {
                    return `<div class="media align-items-center">
                                <div class="media-head me-2">
                                    <div class="avatar avatar-xs avatar-success avatar-rounded">
                                        <span class="initial-wrap">` + row.title.charAt(0).toUpperCase() + `</span>
                                    </div>
                                </div>
                                <div class="media-body">
                                        <span class="d-block">` + row.title + `</span>
                                </div>
                            </div>`;
                }
            }, {
                'data': 'representative', render: (data, type, row, meta) => {
                    return `<span class="badge badge-primary">` + row.representative + `</span>`;
                }
            }, {
                'data': 'license', render: (data, type, row, meta) => {
                    return `<span>` + row.license + `</span>`;
                }
            }]
    }

    function initDataTable(config) {
        /*DataTable Init*/
        let dtb = $('#datable_company_list');
        if (dtb.length > 0) {
            var targetDt = dtb.DataTable(config);
            $("div.blog-toolbar-left").html('<div class="d-xxl-flex d-none align-items-center"> <select class="form-select form-select-sm w-120p"><option selected>Bulk actions</option><option value="1">Edit</option><option value="2">Move to trash</option></select> <button class="btn btn-sm btn-light ms-2">Apply</button></div><div class="d-xxl-flex d-none align-items-center form-group mb-0"> <label class="flex-shrink-0 mb-0 me-2">Sort by:</label> <select class="form-select form-select-sm w-130p"><option selected>Date Created</option><option value="1">Date Edited</option><option value="2">Frequent Contacts</option><option value="3">Recently Added</option> </select></div> <select class="d-flex align-items-center w-130p form-select form-select-sm"><option selected>Export to CSV</option><option value="2">Export to PDF</option><option value="3">Send Message</option><option value="4">Delegate Access</option> </select>');
            dtb.parent().addClass('table-responsive');
        }
    }

    function loadUserDetail() {
        let url = window.location.pathname;
        $.fn.callAjax(url + '/api', 'GET')
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $('#inp-company_current_id').val(data.user.company_current_id);
                        $('#inp-first_name').val(data.user.first_name);
                        $('#inp-last_name').val(data.user.last_name);
                        $('#inp-full_name').val(data.user.full_name);
                        $('#inp-email').val(data.user.email);
                        $('#inp-username').val(data.user.username);
                        config['data'] = data.user.company;
                        console.log(config['data'])
                    }
                    initDataTable(config);
                },
                (errs) => {
                    initDataTable(config);
                }
            )
    }

    loadUserDetail();

    function loadCompanyList(ele) {
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    if (data.hasOwnProperty('company_list') && Array.isArray(data.company_list)) {
                        data.company_list.map(function (item) {
                            if (item.id == $('#inp-company_current_id').val()) {
                                ele.append(`<option selected value="` + item.id + `">` + item.title + `</option>`)
                            } else {
                                ele.append(`<option value="` + item.id + `">` + item.title + `</option>`)
                            }
                        })
                    }
                }
            }
        )
    }

    loadCompanyList($('#select-box-company'));
})
    ;