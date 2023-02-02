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
            "searchable": false, "orderable": false,
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
        }
    }

    function loadUserDetail() {
        let url = window.location.pathname;
        $.fn.callAjax(url + '/api', 'GET')
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        console.log(data)
                        $('#inp-company_current_id').val(data.user.company_current_id);
                        $('#inp-first_name').val(data.user.first_name);
                        $('#inp-last_name').val(data.user.last_name);
                        $('#inp-full_name').val(data.user.full_name);
                        $('#inp-email').val(data.user.email);
                        $('#inp-username').val(data.user.username);
                        config['data'] = data.user.company;
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
                        console.log(data)
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