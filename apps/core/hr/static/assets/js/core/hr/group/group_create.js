$(function () {
    $(document).ready(function () {
        let frm = $('#frm_group_create');
        loadDataCommon(frm);

        $(document).on('change', '#select-box-group-level', function () {
            let sel = $(this)[0].options[$(this)[0].selectedIndex]
            let ref_group_title = sel.getAttribute('data-description')
            let first_manager_system_title = sel.getAttribute('data-first-manager-description');
            let second_manager_system_title = sel.getAttribute('data-second-manager-description');
            $('#reference-group-title').val(ref_group_title);
            $('#first-manager-system-title').val(first_manager_system_title);
            $('#second-manager-system-title').val(second_manager_system_title);
            let level = sel.getAttribute('data-level');
            loadGroupListFilter(level)
        });

        $('#btn-add-employee-to-group').on('click', function() {
            loadCheckboxTableEmployee();
        });

        $('#btn-confirm-add-purchase-request').on('click', function() {
            loadDataEmployeeShow();
        });

        $('#datable_employee_show_list').on('click', '.del-row', function() {
            deleteEmployeeShow(this.id);
        });

// SUBMIT FORM
        frm.submit(function (e) {
            e.preventDefault();
            let frm = new SetupFormSubmit($(this));
            frm.dataForm['group_employee'] = JSON.parse($('#data-group_employee').val());
            if (frm.dataForm) {
                for (let key in frm.dataForm) {
                    if (frm.dataForm[key] === '') {
                        delete frm.dataForm[key]
                    }
                }
            }
            let csr = $("input[name=csrfmiddlewaretoken]").val();
            $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm, csr)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: data.message}, 'success')
                            $.fn.redirectUrl(frm.dataUrlRedirect, 1000);
                        }
                    },
                    (errs) => {
                        console.log(errs)
                    }
                )
        });


    });
});

// load common
function loadDataCommon(frm) {
    if (frm.attr('data-method') === "POST") {
        loadGroupLevelList();
        loadGroupList();
        loadFirstManagerList();
        loadSecondManagerList();
        dataTableEmployee();
    } else if (frm.attr('data-method') === "PUT") {
        $.fn.callAjax(frm.attr('data-url'), 'GET').then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $('#reference-group-title').val(data.group.group_level.description);
                    $('#group-title').val(data.group.title);
                    $('#group-code').val(data.group.code);
                    $('#group-description').val(data.group.description);
                    $('#first-manager-system-title').val(data.group.group_level.first_manager_description);
                    $('#second-manager-system-title').val(data.group.group_level.second_manager_description);
                    $('#first-manager-title').val(data.group.first_manager_title);
                    $('#second-manager-title').val(data.group.second_manager_title);
                    loadGroupLevelList(data.group.group_level?.id);
                    loadGroupList(data.group.parent_n?.id);
                    loadFirstManagerList(data.group.first_manager?.id);
                    loadSecondManagerList(data.group.second_manager?.id);
                    dataTableEmployee();
                    dataTableEmployeeShow(data.group.group_employee);
                    let emp_id_list = [];
                    for (let emp of data.group.group_employee) {
                        emp_id_list.push(emp.id);
                    }
                    $('#data-group_employee').val(JSON.stringify(emp_id_list));
                }
            }
        )
    }
}

function loadCheckboxTableEmployee() {
    let emp_list = $('#data-group_employee').val();
    if (emp_list) {
        let table = document.getElementById('datable_employee_list');
        let eleCheckboxList = table.querySelectorAll('.table-row-checkbox');
        for (let item of eleCheckboxList) {
            if (JSON.parse(emp_list).includes(item.id)) {
                item.checked = true;
            }
        }
    }
}

// load group list filter by level
function loadGroupListFilter(level) {
    if (level) {
        let ele = $('#select-box-group');
        let url = '/hr/group/parent/' + level
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    if (data.hasOwnProperty('group_parent_list') && Array.isArray(data.group_parent_list)) {
                        ele.append(`<option>` + `</option>`)
                        data.group_parent_list.map(function (item) {
                            let text = item.title + '-level ' + item.level
                            ele.append(`<option value="${item.id}">${text}</option>`)
                        })
                    }
                }
            }
        )
    }
}

// load group level list
function loadGroupLevelList(valueSelected = null) {
    let ele = $('#select-box-group-level');
    let url = ele.attr('data-url');
    let method = ele.attr('data-method');
    $.fn.callAjax(url, method).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                ele.text("");
                if (data.hasOwnProperty('group_level_list') && Array.isArray(data.group_level_list)) {
                    ele.append(`<option>` + `</option>`)
                    data.group_level_list.map(function (item) {
                        let option = `<option 
                                        value="${item.id}"
                                        data-level="${item.level}" 
                                        data-description="${item.description}" 
                                        data-first-manager-description="${item.first_manager_description}"
                                        data-second-manager-description="${item.second_manager_description}"
                                    >level ` + item.level + `</option>`;
                        if (valueSelected && valueSelected === item.id) {
                            option = `<option 
                                        value="${item.id}"
                                        data-level="${item.level}" 
                                        data-description="${item.description}" 
                                        data-first-manager-description="${item.first_manager_description}"
                                        data-second-manager-description="${item.second_manager_description}"
                                        selected
                                    >level ` + item.level + `</option>`;
                        }
                        ele.append(option);
                    })
                }
            }
        }
    )
}

// load group list
function loadGroupList(valueSelected = null) {
    let ele = $('#select-box-group');
    let url = ele.attr('data-url');
    let method = ele.attr('data-method');
    $.fn.callAjax(url, method).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                ele.text("");
                if (data.hasOwnProperty('group_list') && Array.isArray(data.group_list)) {
                    ele.append(`<option>` + `</option>`)
                    data.group_list.map(function (item) {
                        let option = `<option value="${item.id}">${item.title}</option>`;
                        if (valueSelected && valueSelected === item.id) {
                            option = `<option value="${item.id}" selected>${item.title}</option>`;
                        }
                        ele.append(option)
                    })
                }
            }
        }
    )
}

// load first manager list
function loadFirstManagerList(valueSelected = null) {
    let ele = $('#select-box-first-manager');
    let url = ele.attr('data-url');
    let method = ele.attr('data-method');
    $.fn.callAjax(url, method).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                ele.text("");
                if (data.hasOwnProperty('employee_list') && Array.isArray(data.employee_list)) {
                    ele.append(`<option>` + `</option>`)
                    data.employee_list.map(function (item) {
                        let option = `<option value="${item.id}">${item.full_name}</option>`;
                        if (valueSelected && valueSelected === item.id) {
                            option = `<option value="${item.id}" selected>${item.full_name}</option>`;
                        }
                        ele.append(option);
                    })
                }
            }
        }
    )
}

// load second manager list
function loadSecondManagerList(valueSelected = null) {
    let ele = $('#select-box-second-manager');
    let url = ele.attr('data-url');
    let method = ele.attr('data-method');
    $.fn.callAjax(url, method).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                ele.text("");
                if (data.hasOwnProperty('employee_list') && Array.isArray(data.employee_list)) {
                    ele.append(`<option>` + `</option>`)
                    data.employee_list.map(function (item) {
                        let option = `<option value="${item.id}">${item.full_name}</option>`;
                        if (valueSelected && valueSelected === item.id) {
                            option = `<option value="${item.id}" selected>${item.full_name}</option>`;
                        }
                        ele.append(option);
                    })
                }
            }
        }
    )
}

// load data employee show
function loadDataEmployeeShow() {
    let data_emp_show = [];
    let checked_id_list = [];
    let table = document.getElementById('datable_employee_list');
    let rowsChecked = table.querySelectorAll('.table-row-checkbox:checked');
    for (let item of rowsChecked) {
        checked_id_list.push(item.id);
        data_emp_show.push({
            'id': item.id,
            'full_name': item.getAttribute('data-title'),
            'role': JSON.parse(item.getAttribute('data-role')),
        });
    }
    $('#data-group_employee').val(JSON.stringify(checked_id_list));
    $('#datable_employee_show_list').DataTable().clear().destroy();
    dataTableEmployeeShow(data_emp_show);
}

// load data employee after delete row
function deleteEmployeeShow(delID) {
    let table = document.getElementById('datable_employee_list');
    let rowsChecked = table.querySelectorAll('.table-row-checkbox:checked');
    for (let item of rowsChecked) {
        if (item.id === delID) {
            item.checked = false;
            break;
        }
    }
    loadDataEmployeeShow();
}

// DATATABLE employee
function dataTableEmployee() {
    let $table = $('#datable_employee_list');
    let frm = new SetupFormSubmit($table);
    $table.DataTableDefault({
        ajax: {
            url: frm.dataUrl,
            type: frm.dataMethod,
            dataSrc: function (resp) {
                let data = $.fn.switcherResp(resp);
                if (data && resp.data.hasOwnProperty('employee_list')) {
                    return resp.data['employee_list'] ? resp.data['employee_list'] : []
                }
                throw Error('Call data raise errors.')
            },
        },
        searching: false,
        paging: false,
        ordering: false,
        info: false,
        columnDefs: [],
        columns: [
            {
                targets: 0,
                render: (data, type, row, meta) => {
                    return `<span class="table-row-order">${(meta.row + 1)}</span>`
                }
            },
            {
                targets: 1,
                render: (data, type, row) => {
                    return `<span class="table-row-code">${row.code}</span>`
                }
            },
            {
                targets: 2,
                render: (data, type, row) => {
                    return `<span class="table-row-title">${row.full_name}</span>`
                }
            },
            {
                targets: 3,
                render: (data, type, row) => {
                    return `<span class="badge badge-soft-primary table-row-group">${row.group.title}</span>`
                },
            },
            {
                targets: 4,
                render: (data, type, row) => {
                    let dataDate = new Date(row.date_joined).toDateString();
                    return `<span class="table-row-date-join">${dataDate}</span>`
                }
            },
            {
                targets: 5,
                render: (data, type, row) => {
                    if (row.is_active === true) {
                        return `<span class="badge badge-info badge-indicator badge-indicator-xl"></span>`;
                    } else {
                        return `<span class="badge badge-light badge-indicator badge-indicator-xl"></span>`;
                    }
                }
            },
            {
                targets: 6,
                render: (data, type, row) => {
                    let role = JSON.stringify(row.role).replace(/"/g, "&quot;");
                    return `<div class="form-check">
                                <input 
                                    type="checkbox" 
                                    class="form-check-input table-row-checkbox" 
                                    id="${row.id}"
                                    data-title="${row.full_name}"
                                    data-role="${role}"
                                >
                            </div>`
                }
            },
        ],
        drawCallback: function () {},
    });
}

// DATATABLE employee show
function dataTableEmployeeShow(data) {
    let $table = $('#datable_employee_show_list');
    $table.DataTableDefault({
        data: data ? data : [],
        searching: false,
        paging: false,
        ordering: false,
        info: false,
        columnDefs: [],
        columns: [
            {
                targets: 0,
                render: (data, type, row, meta) => {
                    return `<span class="table-row-order">${(meta.row + 1)}</span>`
                }
            },
            {
                targets: 1,
                render: (data, type, row) => {
                    return `<span class="table-row-title">${row.full_name}</span>`
                }
            },
            {
                targets: 2,
                render: (data, type, row) => {
                    let result = [];
                    row.role.map(item => item.title ? result.push(`<span class="badge badge-soft-primary">` + item.title + `</span>`) : null);
                    return result.join(" ");
                },
            },
            {
                targets: 3,
                render: (data, type, row) => {
                    return `<button type="button" class="btn btn-icon btn-rounded flush-soft-hover del-row" id="${row.id}"><span class="icon"><i class="fa-regular fa-trash-can"></i></span></button>`
                }
            },
        ],
        drawCallback: function () {
        },
    });
}