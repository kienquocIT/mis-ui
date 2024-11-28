class GroupLoadDataHandle {
    static boxGroupLevel = $('#select-box-group-level');
    static boxGroupParent = $('#select-box-group');
    static box1stManager = $('#select-box-first-manager');
    static box2ndManager = $('#select-box-second-manager');
    static $trans = $('#app-trans-factory');

    static loadInitS2($ele, data = [], dataParams = {}, $modal = null, isClear = false, customRes = {}) {
        let opts = {'allowClear': isClear};
        $ele.empty();
        if (data.length > 0) {
            opts['data'] = data;
        }
        if (Object.keys(dataParams).length !== 0) {
            opts['dataParams'] = dataParams;
        }
        if ($modal) {
            opts['dropdownParent'] = $modal;
        }
        if (Object.keys(customRes).length !== 0) {
            opts['templateResult'] = function (state) {
                let res1 = `<span class="badge badge-soft-primary mr-2">${state.data?.[customRes['res1']] ? state.data?.[customRes['res1']] : "--"}</span>`
                let res2 = `<span>${state.data?.[customRes['res2']] ? state.data?.[customRes['res2']] : "--"}</span>`
                return $(`<span>${res1} ${res2}</span>`);
            }
        }
        $ele.initSelect2(opts);
        return true;
    };

    static loadDataCommon() {
        GroupLoadDataHandle.loadInitS2(GroupLoadDataHandle.boxGroupLevel);
        GroupLoadDataHandle.loadInitS2(GroupLoadDataHandle.boxGroupParent);
        GroupLoadDataHandle.loadInitS2(GroupLoadDataHandle.box1stManager, [], {}, null, true, {'res1': 'code', 'res2': 'full_name'});
        GroupLoadDataHandle.loadInitS2(GroupLoadDataHandle.box2ndManager, [], {}, null, true, {'res1': 'code', 'res2': 'full_name'});
        dataTableEmployee();
        dataTableEmployeeShow();
    };

    static loadDetail(data) {
        $('#reference-group-title').val(data?.['group_level']?.['description']);
        $('#group-title').val(data?.['title']);
        $('#group-code').val(data?.['code']);
        $('#group-description').val(data?.['description']);
        $('#first-manager-system-title').val(data?.['group_level']?.['first_manager_description']);
        $('#second-manager-system-title').val(data?.['group_level']?.['second_manager_description']);
        $('#first-manager-title').val(data?.['first_manager_title']);
        $('#second-manager-title').val(data?.['second_manager_title']);
        if (data?.['group_level']?.['level']) {
            GroupLoadDataHandle.loadInitS2(GroupLoadDataHandle.boxGroupLevel, [data?.['group_level']]);
            GroupLoadDataHandle.loadInitS2(GroupLoadDataHandle.boxGroupParent, [data?.['parent_n']], {'group_level__level__lt': parseInt(data?.['group_level']?.['level'])});
        }
        GroupLoadDataHandle.loadInitS2(GroupLoadDataHandle.box1stManager, [data?.['first_manager']]);
        GroupLoadDataHandle.loadInitS2(GroupLoadDataHandle.box2ndManager, [data?.['second_manager']]);

        $('#datable_employee_show_list').DataTable().rows.add(data?.['group_employee']).draw();
        let emp_id_list = [];
        for (let emp of data?.['group_employee']) {
            emp_id_list.push(emp.id);
        }
        $('#data-group_employee').val(JSON.stringify(emp_id_list));
    };

// load data employee show
    static loadDataEmployeeShow() {
        let tableShow = $('#datable_employee_show_list');
        let data_emp_show = [];
        let checked_id_list = [];
        let table = document.getElementById('datable_employee_list');
        $(table).DataTable().rows().every(function () {
            let row = this.node();
            let eleCheck = row.querySelector('.table-row-checkbox');
            if (eleCheck.checked === true) {
                checked_id_list.push(eleCheck.id);
                data_emp_show.push({
                    'id': eleCheck.id,
                    'full_name': eleCheck.getAttribute('data-title'),
                    'role': JSON.parse(eleCheck.getAttribute('data-role')),
                });
            }
        });
        $('#data-group_employee').val(JSON.stringify(checked_id_list));
        tableShow.DataTable().clear().draw();
        tableShow.DataTable().rows.add(data_emp_show).draw();
    }

}

// FUNCTIONS COMMON
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
    GroupLoadDataHandle.loadDataEmployeeShow();
}

// DATATABLE employee
function dataTableEmployee() {
    let $table = $('#datable_employee_list');
    let frm = new SetupFormSubmit($table);
    $table.DataTableDefault({
        // useDataServer: true,
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
        // paging: false,
        // info: false,
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
                    return `<span class="table-row-code">${row?.['code']}</span>`
                }
            },
            {
                targets: 2,
                render: (data, type, row) => {
                    return `<span class="table-row-title">${row?.['full_name']}</span>`
                }
            },
            {
                targets: 3,
                render: (data, type, row) => {
                    if (row?.['group']?.['title']) {
                        return `<span class="badge badge-light badge-outline table-row-group">${row?.['group']?.['title']}</span>`;
                    }
                    return ``;
                },
            },
            {
                targets: 4,
                render: (data, type, row) => {
                    if (row?.role && Array.isArray(row?.['role'])) {
                        let result = [];
                        row.role.map(item => item.title ? result.push(`<span class="badge badge-light badge-outline mb-1 mr-1">` + item.title + `</span>`) : null);
                        return result.join(" ");
                    }
                    return '';
                },
            },
            {
                targets: 5,
                render: (data, type, row) => {
                    let dataDate = new Date(row?.['date_joined']).toDateString();
                    return `<span class="table-row-date-join">${dataDate}</span>`
                }
            },
            {
                targets: 6,
                render: (data, type, row) => {
                    let role = JSON.stringify(row?.['role']).replace(/"/g, "&quot;");
                    let dataGroupEmployee = $('#data-group_employee');
                    let employee_id_checked_list = [];
                    if (dataGroupEmployee.val()) {
                        employee_id_checked_list = JSON.parse(dataGroupEmployee.val());
                    }
                    if (!employee_id_checked_list.includes(row?.['id'])) {
                        return `<div class="form-check form-check-lg">
                                <input 
                                    type="checkbox" 
                                    class="form-check-input table-row-checkbox" 
                                    id="${row?.['id']}"
                                    data-title="${row?.['full_name']}"
                                    data-role="${role}"
                                >
                            </div>`
                    } else {
                        return `<div class="form-check form-check-lg">
                                <input 
                                    type="checkbox" 
                                    class="form-check-input table-row-checkbox" 
                                    id="${row?.['id']}"
                                    data-title="${row?.['full_name']}"
                                    data-role="${role}"
                                    checked
                                >
                            </div>`
                    }
                }
            },
        ],
        drawCallback: function () {
        },
    });
}

// DATATABLE employee show
function dataTableEmployeeShow(data) {
    let $table = $('#datable_employee_show_list');
    $table.DataTableDefault({
        data: data ? data : [],
        paging: false,
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
                    return `<span class="table-row-title">${row?.['full_name']}</span>`
                }
            },
            {
                targets: 2,
                render: (data, type, row) => {
                    let result = [];
                    row.role.map(item => item.title ? result.push(`<span class="badge badge-light badge-outline">` + item.title + `</span>`) : null);
                    return result.join(" ");
                },
            },
            {
                targets: 3,
                render: (data, type, row) => {
                    let form = $('#frm_group_create');
                    if (form.attr('data-method') !== "GET") {
                        return `<button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row" id="${row?.['id']}"><span class="icon"><i class="fa-regular fa-trash-can"></i></span></button>`;
                    } else {
                        return `<button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row" id="${row?.['id']}" disabled><span class="icon"><i class="fa-regular fa-trash-can"></i></span></button>`
                    }
                }
            },
        ],
        drawCallback: function () {},
    });
}