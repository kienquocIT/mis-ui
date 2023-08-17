class GroupLoadDataHandle {
    static boxGroupLevel = $('#select-box-group-level');
    static boxGroupParent = $('#select-box-group');
    static box1stManager = $('#select-box-first-manager');
    static box2ndManager = $('#select-box-second-manager');

    static loadDataCommon(frm) {
        if (frm.attr('data-method') === "POST") {
            GroupLoadDataHandle.loadGroupLevelList();
            GroupLoadDataHandle.loadGroupParentList();
            GroupLoadDataHandle.loadFirstManagerList();
            GroupLoadDataHandle.loadSecondManagerList();
            dataTableEmployee();
            dataTableEmployeeShow();
        }
        if (frm.attr('data-method') === "PUT" || frm.attr('data-method') === "GET") {
            $.fn.callAjax2({url: frm.attr('data-url'), method: 'GET'}).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        let groupData = data?.['group'];
                        if (groupData){
                            $x.fn.renderCodeBreadcrumb(groupData);
                            $('#reference-group-title').val(groupData?.['group_level']?.['description']);
                            $('#group-title').val(groupData?.title);
                            $('#group-code').val(groupData?.code);
                            $('#group-description').val(groupData?.description);
                            $('#first-manager-system-title').val(groupData?.['group_level']?.['first_manager_description']);
                            $('#second-manager-system-title').val(groupData?.['group_level']?.['second_manager_description']);
                            $('#first-manager-title').val(groupData?.['first_manager_title']);
                            $('#second-manager-title').val(groupData?.['second_manager_title']);
                            GroupLoadDataHandle.loadGroupLevelList(groupData?.['group_level']);
                            GroupLoadDataHandle.loadGroupParentList(groupData?.['parent_n']);
                            GroupLoadDataHandle.loadFirstManagerList(groupData?.['first_manager']);
                            GroupLoadDataHandle.loadSecondManagerList(groupData?.['second_manager']);
                            dataTableEmployeeShow();
                            $('#datable_employee_show_list').DataTable().rows.add(groupData?.['group_employee']).draw();
                            let emp_id_list = [];
                            for (let emp of groupData?.['group_employee']) {
                                emp_id_list.push(emp.id);
                            }
                            $('#data-group_employee').val(JSON.stringify(emp_id_list));
                            dataTableEmployee();
                        }
                    }
                }
            )
        }
    }

    static loadCheckboxTableEmployee() {
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
    static loadGroupParentList(dataGroupParent = {}, level = null) {
        let ele = GroupLoadDataHandle.boxGroupParent;
        ele.initSelect2({
            data: dataGroupParent,
            'dataParams': {'group_level__level__lt': parseInt(level)},
            disabled: !(ele.attr('data-url')),
            callbackTextDisplay: function (item) {
                return item?.['title'] + '-level' + String(item?.['level']) || '';
            },
        });
    }

// load group level list
    static loadGroupLevelList(dataLevel = {}) {
        let ele = GroupLoadDataHandle.boxGroupLevel;
        ele.initSelect2({
            data: dataLevel,
            disabled: !(ele.attr('data-url')),
            callbackTextDisplay: function (item) {
                return 'Level' + item?.['level'] || '';
            },
        });
    }

// load first manager list
    static loadFirstManagerList(dataEmployee = {}) {
        let ele = GroupLoadDataHandle.box1stManager;
        ele.initSelect2({
            data: dataEmployee,
            disabled: !(ele.attr('data-url')),
            callbackTextDisplay: function (item) {
                return item?.['full_name'] || '';
            },
        });
    }

// load second manager list
    static loadSecondManagerList(dataEmployee = {}) {
        let ele = GroupLoadDataHandle.box2ndManager;
        ele.initSelect2({
            data: dataEmployee,
            disabled: !(ele.attr('data-url')),
            callbackTextDisplay: function (item) {
                return item?.['full_name'] || '';
            },
        });
    }

// load data employee show
    static loadDataEmployeeShow() {
        let tableShow = $('#datable_employee_show_list');
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
        tableShow.DataTable().clear();
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
                    let employee_id_checked_list = JSON.parse($('#data-group_employee').val());
                    if (!employee_id_checked_list.includes(row.id)) {
                        return `<div class="form-check">
                                <input 
                                    type="checkbox" 
                                    class="form-check-input table-row-checkbox" 
                                    id="${row.id}"
                                    data-title="${row.full_name}"
                                    data-role="${role}"
                                >
                            </div>`
                    } else {
                        return `<div class="form-check">
                                <input 
                                    type="checkbox" 
                                    class="form-check-input table-row-checkbox" 
                                    id="${row.id}"
                                    data-title="${row.full_name}"
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
                    let form = $('#frm_group_create');
                    if (form.attr('data-method') !== "GET") {
                        return `<button type="button" class="btn btn-icon btn-rounded flush-soft-hover del-row" id="${row.id}"><span class="icon"><i class="fa-regular fa-trash-can"></i></span></button>`;
                    } else {
                        return `<button type="button" class="btn btn-icon btn-rounded flush-soft-hover del-row" id="${row.id}" disabled><span class="icon"><i class="fa-regular fa-trash-can"></i></span></button>`
                    }
                }
            },
        ],
        drawCallback: function () {
        },
    });
}