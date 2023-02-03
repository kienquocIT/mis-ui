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
            'render': (data, type, row, meta) => {
                let currentId = "chk_sel_" + String(meta.row + 1)
                return `<span class="form-check mb-0"><input type="checkbox" class="form-check-input check-select" id="${currentId}" data-id=` + row.id + `><label class="form-check-label" for="${currentId}"></label></span>`;
            }
        }, {
            'data': 'title', 'render': (data, type, row, meta) => {

                return `<div class="media">
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
            'data': 'abbreviation', render: (data, type, row, meta) => {
                return `<span>` + row.abbreviation + `</span>`;
            }
        }, {
            'data': 'holder', render: (data, type, row, meta) => {
                let element = ''
                for (let i = 0; i < row.holder.length; i++) {
                    element += `<span class="badge badge-soft-primary w-20 mt-1 ml-1">` + row.holder[i].full_name + `</span>`;
                }
                if (row.holder.length > 4)
                    return `<div class="row">` + element + `</div>`
                else
                    return `<div class="row"><center>` + element + `</center></div>`
            }
        }, {
            'className': 'action-center', 'render': (data, type, row, meta) => {
                let bt2 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Edit" href="#" data-id="` + row.id + `"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="edit"></i></span></span></a>`;
                let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover del-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="#" data-id="` + row.id + `"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`;
                return `<div class="text-center">` + bt2 + bt3 + `</div>`;
            }
        },]
    }

    function initDataTable(config) {
        /*DataTable Init*/
        let dtb = $('#datatable_role_list');
        if (dtb.length > 0) {
            var targetDt = dtb.DataTable(config);
            /*Checkbox Add*/
            $(document).on('click', '.del-button', function () {
                targetDt.rows('.selected').remove().draw(false);
                return false;
            });
            $("div.blog-toolbar-left").html('<div class="d-xxl-flex d-none align-items-center"> <select class="form-select form-select-sm w-120p"><option selected>Bulk actions</option><option value="1">Edit</option><option value="2">Move to trash</option></select> <button class="btn btn-sm btn-light ms-2">Apply</button></div><div class="d-xxl-flex d-none align-items-center form-group mb-0"> <label class="flex-shrink-0 mb-0 me-2">Sort by:</label> <select class="form-select form-select-sm w-130p"><option selected>Date Created</option><option value="1">Date Edited</option><option value="2">Frequent Contacts</option><option value="3">Recently Added</option> </select></div> <select class="d-flex align-items-center w-130p form-select form-select-sm"><option selected>Export to CSV</option><option value="2">Export to PDF</option><option value="3">Send Message</option><option value="4">Delegate Access</option> </select>');
            dtb.parent().addClass('table-responsive');
            /*Select all using checkbox*/
            var DT1 = dtb.DataTable();
        }
    }

    function loadDataTable() {
        let tb = $('#datatable_role_list');
        $.fn.callAjax(tb.attr('data-url'), tb.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('role_list')) {
                    config['data'] = resp.data.role_list;
                }
                initDataTable(config);
            }
        }, (errs) => {
            initDataTable(config);
        },)
    }

    loadDataTable();
});

$("tbody").on("click", ".del-button", function () {
    if (confirm("Confirm Delete Role") === true) {
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let role_id = $(this).attr('data-id');
        let form = $('#form-delete');
        let role_data = {
            'csrfmiddlewaretoken': csr,
            'id': role_id
        }
        let data_url = form.attr('data-url');
        $.fn.callAjax(data_url + '/' + role_id + '/api', "DELETE", role_data, csr).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                console.log(resp);
                $.fn.notifyPopup({description: "Thành công"}, 'success')
                $.fn.redirectUrl(location.pathname, 1000);
            }
        }, (errs) => {
            $.fn.notifyPopup({description: "Thất bại"}, 'failure')
        },)
    }
});

$("tbody").on("click", ".edit-button", function () {
    let form = $('#form-delete');
    let data_url = form.attr('data-url') + '/' + $(this).attr('data-id');
    $(this).attr("href", data_url);
});


$(document).on('click', '.check-select', function () {
    if ($(this).is(":checked")) {
        $(this).closest('tr').addClass('selected');
    } else {
        $(this).closest('tr').removeClass('selected');
        $('.check-select-all').prop('checked', false);
    }
});


$(document).on('click', '.check-select-all', function () {
    $('.check-select').attr('checked', true);
    let table = $('#datatable_role_list').DataTable();
    let indexList = table.rows().indexes();
    console.log(indexList.length)
    if ($(this).is(":checked")) {
        for (let idx = 0; idx < indexList.length; idx++) {
            let rowNode = table.rows(indexList[idx]).nodes()[0];
            rowNode.classList.add('selected');
            rowNode.firstElementChild.children[0].firstElementChild.checked = true;
        }
        $('.check-select').prop('checked', true);
    } else {
        for (let idx = 0; idx < indexList.length; idx++) {
            let rowNode = table.rows(indexList[idx]).nodes()[0];
            rowNode.classList.remove("selected");
            rowNode.firstElementChild.children[0].firstElementChild.checked = false;
        }
        $('.check-select').prop('checked', false);
    }
});
