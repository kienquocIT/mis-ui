$(document).ready(function () {
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
                let currentId = meta.row
                return `<span class="form-check mb-0"><input type="checkbox" class="form-check-input check-select" id="${currentId}" data-id=` + row.id + `><label class="form-check-label" for="${currentId}"></label></span>`;
            }
        }, {
            'data': 'code', render: (data, type, row, meta) => {
                return String.format(`<b>{0}</b>`, data);
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
                        return `<span class="badge badge-soft-primary">` + row.group.title + `</span>`;
                    }
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
        },]
    }

    function initDataTable(config) {
        /*DataTable Init*/
        let dtb = $('#datatable_employee_list');
        if (dtb.length > 0) {
            var targetDt = dtb.DataTable(config);
            /*Select all using checkbox*/
            var DT1 = dtb.DataTable();
        }
    }

    function loadDataTable() {
        let tb = $('#datatable_employee_list');
        $.fn.callAjax(tb.attr('data-url'), tb.attr('data-method')).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('employee_list')) config['data'] = data.employee_list;
                    initDataTable(config);

                    let url = location.pathname + `/api`
                    $.fn.callAjax(url, 'GET')
                        .then(
                            (resp) => {
                                let data = $.fn.switcherResp(resp);
                                if (data) {
                                    $('#abbreviation').val(data.role.abbreviation)
                                    $('#role_name').val(data.role.title)
                                    $('#code').val(data.role.code)
                                    let table = $("#datatable_employee_list").DataTable();
                                    let indexList = table.rows().indexes();
                                    for (let idx = 0; idx < indexList.length; idx++) {
                                        let rowNode = table.rows(indexList[idx]).nodes()[0]
                                        for (let i = 0; i < data.role.employees.length; i++) {
                                            if (data.role.employees[i].id === rowNode.firstElementChild.children[0].firstElementChild.getAttribute('data-id')) {
                                                rowNode.firstElementChild.children[0].firstElementChild.checked = true;
                                            }

                                        }
                                    }
                                }
                            },
                            (errs) => {
                                console.log(errs)
                            }
                        )
                }
            },
        )
    }

    loadDataTable();
});


// submit form update
$("#form-update-role").submit(function (event) {
        if (confirm("Bạn có muốn lưu thay đổi ?") === true) {
            event.preventDefault();
            let data_url = location.pathname + '/api';
            let csr = $("input[name=csrfmiddlewaretoken]").val();
            let frm = new SetupFormSubmit($(this));
            let data = frm.dataForm;
            const employee_list = [];
            let table = $("#datatable_employee_list").DataTable();
            let indexList = table.rows().indexes();
            for (let idx = 0; idx < indexList.length; idx++) {
                let rowNode = table.rows(indexList[idx]).nodes()[0]
                if (rowNode.firstElementChild.children[0].firstElementChild.checked === true){
                    employee_list.push(rowNode.firstElementChild.children[0].firstElementChild.getAttribute('data-id'))
                }
            }
            data['employees'] = employee_list;
            $.fn.callAjax(data_url, frm.dataMethod, data, csr)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyPopup({description: "Đang cập nhật Role"}, 'success');
                            $.fn.redirectUrl(frm.dataUrlRedirect, 1000);
                        }
                    },
                    (errs) => {
                        // $.fn.notifyPopup({description: errs.data}, 'failure')
                    }
                )
        }
    }
);

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
    let table = $('#datatable_employee_list').DataTable();
    let indexList = table.rows().indexes();
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
