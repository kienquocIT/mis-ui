class GroupLoadDataHandle {
    static $form = $('#frm_group_create');
    static boxGroupLevel = $('#select-box-group-level');
    static boxGroupParent = $('#select-box-group');
    static box1stManager = $('#select-box-first-manager');
    static box2ndManager = $('#select-box-second-manager');
    static $eleGrEmp = $('#data-group_employee');
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
                let res1 = `<span class="badge badge-soft-light mr-2">${state.data?.[customRes['res1']] ? state.data?.[customRes['res1']] : "--"}</span>`
                let res2 = `<span>${state.data?.[customRes['res2']] ? state.data?.[customRes['res2']] : "--"}</span>`
                return $(`<span>${res1} ${res2}</span>`);
            }
        }
        $ele.initSelect2(opts);
        return true;
    };

    static loadUpperAlphanumeric(ele) {
        ele.value = ele.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        return true;
    };

    static loadCssToDtb(tableID) {
        let tableIDWrapper = tableID + '_wrapper';
        let tableWrapper = document.getElementById(tableIDWrapper);
        if (tableWrapper) {
            let headerToolbar = tableWrapper.querySelector('.dtb-header-toolbar');
            if (headerToolbar) {
                headerToolbar.classList.add('hidden');
            }
        }
    };

    static loadInit() {
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
        GroupLoadDataHandle.$eleGrEmp.val(JSON.stringify(emp_id_list));
        $('#datable_employee_list').DataTable().draw();
    };

    static loadDetailEmpChecked() {
        let $table = $('#datable_employee_list');
        if (GroupLoadDataHandle.$eleGrEmp.val()) {
            let employee_id_checked_list = JSON.parse(GroupLoadDataHandle.$eleGrEmp.val());
            $table.DataTable().rows().every(function () {
                let row = this.node();
                if (row.querySelector('.table-row-checkbox')) {
                    if (employee_id_checked_list.includes(row.querySelector('.table-row-checkbox').id)) {
                        row.querySelector('.table-row-checkbox').checked = true;
                    }
                }
            });
        }
        return true;
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
        GroupLoadDataHandle.$eleGrEmp.val(JSON.stringify(checked_id_list));
        tableShow.DataTable().clear().draw();
        tableShow.DataTable().rows.add(data_emp_show).draw();
    }

}

class GroupCommonHandle {
    static filterFieldList(field_list, data_json) {
        for (let key in data_json) {
            if (!field_list.includes(key)) delete data_json[key]
        }
        return data_json;
    }
}

// FUNCTIONS COMMON
// load data employee after delete row
function deleteEmployeeShow(delID) {
    let $table = $('#datable_employee_list');
    $table.DataTable().rows().every(function () {
        let row = this.node();
        if (row.querySelector('.table-row-checkbox')) {
            if (row.querySelector('.table-row-checkbox').id === delID) {
                row.querySelector('.table-row-checkbox').checked = false;
            }
        }
    });
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
        columnDefs: [],
        columns: [
            {
                targets: 0,
                width: '5%',
                render: (data, type, row, meta) => {
                    return `<span class="table-row-order">${(meta.row + 1)}</span>`
                }
            },
            {
                targets: 1,
                width: '15%',
                render: (data, type, row) => {
                    return `<span class="table-row-code">${row?.['code']}</span>`
                }
            },
            {
                targets: 2,
                width: '20%',
                render: (data, type, row) => {
                    return `<span class="table-row-title">${row?.['full_name']}</span>`
                }
            },
            {
                targets: 3,
                width: '20%',
                render: (data, type, row) => {
                    if (row?.['group']?.['title']) {
                        return `<span>${row?.['group']?.['title']}</span>`;
                    }
                    return ``;
                },
            },
            {
                targets: 4,
                width: '20%',
                render: (data, type, row) => {
                    if (row?.role && Array.isArray(row?.['role'])) {
                        let result = [];
                        row.role.map(item => item.title ? result.push(`<span>` + item.title + `</span>`) : null);
                        return result.join(", ");
                    }
                    return '';
                },
            },
            {
                targets: 5,
                width: '15%',
                render: (data, type, row) => {
                    if (row?.['date_joined']) {
                        return moment(row?.['date_joined']).format('DD/MM/YYYY');
                    }
                    return ``;
                }
            },
            {
                targets: 6,
                width: '5%',
                render: (data, type, row) => {
                    let role = JSON.stringify(row?.['role']).replace(/"/g, "&quot;");
                    let checked = "";
                    let employee_id_checked_list = [];
                    if (GroupLoadDataHandle.$eleGrEmp.val()) {
                        employee_id_checked_list = JSON.parse(GroupLoadDataHandle.$eleGrEmp.val());
                    }
                    if (employee_id_checked_list.includes(row?.['id'])) {
                        checked = "checked";
                    }
                    return `<div class="form-check form-check-lg">
                                <input 
                                    type="checkbox" 
                                    class="form-check-input table-row-checkbox" 
                                    id="${row?.['id']}"
                                    data-title="${row?.['full_name']}"
                                    data-role="${role}"
                                    ${checked}
                                >
                            </div>`;
                }
            },
        ],
        drawCallback: function () {
            GroupLoadDataHandle.loadDetailEmpChecked();
        },
    });
}

// DATATABLE employee show
function dataTableEmployeeShow(data) {
    let $table = $('#datable_employee_show_list');
    $table.DataTableDefault({
        data: data ? data : [],
        paging: false,
        searching: false,
        info: false,
        columnDefs: [],
        columns: [
            {
                targets: 0,
                width: '5%',
                render: (data, type, row, meta) => {
                    return `<span class="table-row-order">${(meta.row + 1)}</span>`
                }
            },
            {
                targets: 1,
                width: '20%',
                render: (data, type, row) => {
                    return `<span class="table-row-title">${row?.['full_name']}</span>`
                }
            },
            {
                targets: 2,
                width: '40%',
                render: (data, type, row) => {
                    let result = [];
                    row.role.map(item => item.title ? result.push(`<span class="badge badge-light badge-outline">` + item.title + `</span>`) : null);
                    return result.join(" ");
                },
            },
            {
                targets: 3,
                width: '5%',
                render: (data, type, row) => {
                    if (GroupLoadDataHandle.$form.attr('data-method').toLowerCase() !== "get") {
                        return `<button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row" id="${row?.['id']}"><span class="icon"><i class="fa-regular fa-trash-can"></i></span></button>`;
                    } else {
                        return `<button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row" id="${row?.['id']}" disabled><span class="icon"><i class="fa-regular fa-trash-can"></i></span></button>`
                    }
                }
            },
        ],
        drawCallback: function () {
            if (GroupLoadDataHandle.$form.attr('data-method').toLowerCase() !== 'get') {
                dtbGroupHDCustom();
            }
        },
    });
}

function dtbGroupHDCustom() {
    let $table = $('#datable_employee_show_list');
    let wrapper$ = $table.closest('.dataTables_wrapper');
    let $theadEle = wrapper$.find('thead');
    if ($theadEle.length > 0) {
        for (let thEle of $theadEle[0].querySelectorAll('th')) {
            if (!$(thEle).hasClass('border-right')) {
                $(thEle).addClass('border-right');
            }
        }
    }
    let headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
    let textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
    headerToolbar$.prepend(textFilter$);

    if (textFilter$.length > 0) {
        textFilter$.css('display', 'flex');
        // Check if the button already exists before appending
        if (!$('#btn-add-emp-group').length) {
            let $group = $(`<button type="button" class="btn btn-primary btn-square" id="btn-add-emp-group" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasExample">
                                <span><span class="icon"><i class="fa-solid fa-plus"></i></span><span>${GroupLoadDataHandle.$trans.attr('data-add-emp-group')}</span></span>
                            </button>`);
            textFilter$.append(
                $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append($group)
            );
        }
    }
}