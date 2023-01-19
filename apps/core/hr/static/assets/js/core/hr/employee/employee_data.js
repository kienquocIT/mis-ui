/*Blog Init*/
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
            'render': () => {
                return '';
            }
        }, {
            'data': 'code', render: (data, type, row, meta) => {
                // return String.format(`<b>{0}</b>`, data);
                let urlEmployeeDetail = "/hr/employee/detail/" + row.id
                return `<a href="${urlEmployeeDetail}">
                    <span><b>${data}</b></span>
                </a>`
            }
        }, {
            'data': 'full_name', 'render': (data, type, row, meta) => {
                if (row.hasOwnProperty('full_name') && row.hasOwnProperty('first_name') && typeof row.full_name === 'string') {
                    return `<div class="media align-items-center">
                                    <div class="media-head me-2">
                                        <div class="avatar avatar-xs avatar-success avatar-rounded">
                                            <span class="initial-wrap">` + row.first_name.charAt(0).toUpperCase() + `</span>
                                        </div>
                                    </div>
                                    <div class="media-body">
                                        <span class="d-block">` + row.full_name + `</span>
                                    </div>
                                </div>`;
                }
                return '';
            }
        }, {
            'render': (data, type, row, meta) => {
                if (row.hasOwnProperty('group') && typeof row.group === "object") {
                    if (Object.keys(row.group).length !== 0) {
                        return `<span class="badge badge-primary">` + row.group.title + `</span>`;
                    }
                }
                return '';
            }
        }, {
            'render': (data, type, row, meta) => {
                if (row.hasOwnProperty('role') && Array.isArray(row.role)) {
                    let result = [];
                    row.role.map(item => item.title ? result.push(`<span class="badge badge-soft-primary">` + item.title + `</span>`) : null);
                    return result.join(" ");
                }
                return '';
            }
        }, {
            'render': (data, type, row, meta) => {
                if (row.hasOwnProperty('date_joined') && typeof row.date_joined === 'string') {
                    return new Date(row.date_joined).toDateString();
                }
                return '';
            }
        }, {
            'className': 'action-center', 'render': (data, type, row, meta) => {
                if (row.hasOwnProperty('is_active') && typeof row.is_active === 'boolean') {
                    if (row.is_active) {
                        return `<span class="badge badge-info badge-indicator badge-indicator-xl"></span>`;
                    } else {
                        return `<span class="badge badge-light badge-indicator badge-indicator-xl"></span>`;
                    }
                }
                return '';
            }
        }, {
            'className': 'action-center', 'render': (data, type, row, meta) => {
                let bt1 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Archive" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="archive"></i></span></span></a>`;
                let bt2 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Edit" href="contact-details.html"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="edit"></i></span></span></a>`;
                let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover del-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`;
                return bt2 + bt3;
            }
        },]
    }

    function initDataTable(config) {
        /*DataTable Init*/
        let dtb = $('#datable_employee_list');
        if (dtb.length > 0) {
            var targetDt = dtb.DataTable(config);
            /*Checkbox Add*/
            var tdCnt = 0;
            $('table tr').each(function () {
                $('<span class="form-check mb-0"><input type="checkbox" class="form-check-input check-select" id="chk_sel_' + tdCnt + '"><label class="form-check-label" for="chk_sel_' + tdCnt + '"></label></span>').appendTo($(this).find("td:first-child"));
                tdCnt++;
            });
            $(document).on('click', '.del-button', function () {
                targetDt.rows('.selected').remove().draw(false);
                return false;
            });
            $("div.blog-toolbar-left").html('<div class="d-xxl-flex d-none align-items-center"> <select class="form-select form-select-sm w-120p"><option selected>Bulk actions</option><option value="1">Edit</option><option value="2">Move to trash</option></select> <button class="btn btn-sm btn-light ms-2">Apply</button></div><div class="d-xxl-flex d-none align-items-center form-group mb-0"> <label class="flex-shrink-0 mb-0 me-2">Sort by:</label> <select class="form-select form-select-sm w-130p"><option selected>Date Created</option><option value="1">Date Edited</option><option value="2">Frequent Contacts</option><option value="3">Recently Added</option> </select></div> <select class="d-flex align-items-center w-130p form-select form-select-sm"><option selected>Export to CSV</option><option value="2">Export to PDF</option><option value="3">Send Message</option><option value="4">Delegate Access</option> </select>');
            dtb.parent().addClass('table-responsive');


            /*Select all using checkbox*/
            var DT1 = dtb.DataTable();
            $(".check-select-all").on("click", function (e) {
                $('.check-select').attr('checked', true);
                if ($(this).is(":checked")) {
                    DT1.rows().select();
                    $('.check-select').prop('checked', true);
                } else {
                    DT1.rows().deselect();
                    $('.check-select').prop('checked', false);
                }
            });
            $(".check-select").on("click", function (e) {
                if ($(this).is(":checked")) {
                    $(this).closest('tr').addClass('selected');
                } else {
                    $(this).closest('tr').removeClass('selected');
                    $('.check-select-all').prop('checked', false);
                }
            });
        }
    }

    function loadDataTable() {
        let tb = $('#datable_employee_list');
        $.fn.callAjax(tb.attr('data-url'), tb.attr('data-method')).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('employee_list')) config['data'] = data.employee_list;
                    initDataTable(config);
                }
            },
        )
    }

    loadDataTable();
});