function loadAuditOutFormEmployee () {
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
            'data': 'code', render: (data, type, row, meta) => {
                return String.format(`<b>{0}</b>`, data);
            }
        }, {
            'render': (data, type, row, meta) => {
                if (row.hasOwnProperty('id') && row.hasOwnProperty('full_name')) {
                    return `<span id="${row.id}">` + row.full_name + `</span>`;
                }
                return '';
            }
        }, {
            'render': (data, type, row, meta) => {
                if (row.hasOwnProperty('user') && row.user.hasOwnProperty('username')) {
                    return row.user.username;
                }
                return '';
            }
        }, {
            'render': (data, type, row, meta) => {
                let currentId = "chk_sel_" + String(meta.row + 1)
                return `<span class="form-check mb-0"><input type="checkbox" class="form-check-input check-select check-add-group-employee" id="${currentId}"><label class="form-check-label" for="${currentId}"></label></span>`;
            }
        }]
    }

    function initDataTable(config) {
        /*DataTable Init*/
        let dtb = $('#datable-audit-out-form-employee');
        if (dtb.length > 0) {
            var targetDt = dtb.DataTable(config);
            /*Checkbox Add*/
            var tdCnt = 0;
            $(document).on('click', '.del-button', function () {
                targetDt.rows('.selected').remove().draw(false);
                return false;
            });
            $("div.blog-toolbar-left").html('<div class="d-xxl-flex d-none align-items-center"> <select class="form-select form-select-sm w-120p"><option selected>Bulk actions</option><option value="1">Edit</option><option value="2">Move to trash</option></select> <button class="btn btn-sm btn-light ms-2">Apply</button></div><div class="d-xxl-flex d-none align-items-center form-group mb-0"> <label class="flex-shrink-0 mb-0 me-2">Sort by:</label> <select class="form-select form-select-sm w-130p"><option selected>Date Created</option><option value="1">Date Edited</option><option value="2">Frequent Contacts</option><option value="3">Recently Added</option> </select></div>');
            dtb.parent().addClass('table-responsive');


            /*Select all using checkbox*/
            var DT1 = dtb.DataTable();
        }
    }

    function loadDataTable() {
        let tb = $('#datable-audit-out-form-employee');
        let url = "/hr/employee/api";
        let method = "GET";
        $.fn.callAjax(url, method).then(
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
}


// Action on open modal node
$(document).on('click', '.open-modal-node', function () {
    $('#modal-node-name-create').val("");
    $('#modal-node-description-create').val("");
});


// Action on add modal node
$(document).on('click', '#btn-add-new-node-create', function () {
    tableNodeAdd()
});


function tableNodeAdd() {
    let nodeAction = [{"0": "Create"}, {"1": "Approve"}, {"2": "Reject"}, {"3": "Return"}, {"4": "Receive"}, {"5": "To do"}]
    let tableShowBodyOffModal = $('#datable-workflow-node-create tbody');

    // while (tableShowBodyOffModal[0].rows.length > 0) {
    //     tableShowBodyOffModal[0].deleteRow(0);
    // }
    let nodeName = $('#modal-node-name-create').val();
    let nodeDescription = $('#modal-node-description-create').val();
    let bt2 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Edit" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></span></span></a>`;
    let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover workflow-node-del-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></span></span></a>`;
    let actionData = bt2 + bt3;
    let actionEle = ``
    for (let a = 0; a < nodeAction.length; a++) {
        for (let key in nodeAction[a]) {
            actionEle += `<li class="d-flex align-items-center justify-content-between mb-3">
            <div class="media d-flex align-items-center">
            <div class="media-body">
            <div>
            <div class="node-action" data-action="${key}">${nodeAction[a][key]}</div>
            </div>
            </div>
            </div>
            <div class="form-check form-check-theme ms-3">
            <input type="checkbox" class="form-check-input" id="customCheck6">
            <label class="form-check-label" for="customCheck6"></label>
            </div>
            </li>`
        }
    }

    tableShowBodyOffModal.append(`<tr><td><span>${nodeName}</span></td><td><span>${nodeDescription}</span></td><td>
<div class="btn-group dropdown">
<i class="fas fa-align-justify" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
    <div class="dropdown-menu w-250p"><div class="h-250p"><div data-simplebar class="nicescroll-bar">
        <ul class="invite-user-list p-0">
            ${actionEle}
        </ul>
    </div>
    </div>
    </div>
</div>
</td>
<td>
<i class="fas fa-align-justify" data-bs-toggle="modal" data-bs-target="#auditModalCreate"></i>
<div
                    class="modal fade" id="auditModalCreate" tabindex="-1" role="dialog"
                    aria-labelledby="exampleModalCenter" aria-hidden="true"
            >
                <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Add audit</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="form-group">
                                <label class="form-label">List source</label>
                                <select
                                        class="form-select" 
                                        id="select-box-audit-option"
                                >
                                    <option></option>
                                    <option value="0">In form</option>
                                    <option value="1">Out form</option>
                                    <option value="2">In workflow</option>
                                </select>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" id="btn-add-audit-create">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
</td><td>${actionData}</td></tr>`);

    return false;
}


// Action on delete row
$(document).on('click', '.workflow-node-del-button', function (e) {
    // $(this).closest('tr').prev().remove();
    // $(this).closest('tr').next().remove();
    let currentRow = $(this).closest('tr')
    currentRow.remove();

    return false;
});


// Action on change audit option
$(document).on('change', '#select-box-audit-option', function (e) {
    let defaultEle = `<div class="form-group">
                                <label class="form-label">List source</label>
                                <select
                                        class="form-select" 
                                        id="select-box-audit-option"
                                >
                                    <option></option>
                                    <option value="0">In form</option>
                                    <option value="1">Out form</option>
                                    <option value="2">In workflow</option>
                                </select>
                            </div>`
    let modalBody = $(this).closest('.modal-body');
    let value = $('#select-box-audit-option').val();
    if (value === "0") {
        modalBody[0].innerHTML = "";
        modalBody.append(defaultEle);
        modalBody.append(`<div class="form-group">
                                <label class="form-label">Select field in form</label>
                                <select
                                        class="form-select" 
                                        id="select-box-audit-option"
                                >
                                    <option></option>
                                    <option>In form</option>
                                    <option>Out form</option>
                                    <option>In workflow</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Editing zone</label>
                                <select
                                        class="form-select" 
                                        id="select-box-audit-option"
                                >
                                    <option></option>
                                    <option>In form</option>
                                    <option>Out form</option>
                                    <option>In workflow</option>
                                </select>
                            </div>`)
        $('#select-box-audit-option').val("0");
    } else if (value === "1") {
        modalBody[0].innerHTML = "";
        modalBody.append(defaultEle);
        modalBody.append(`<div class="form-group">
                                <label class="form-label">Employee list</label>
                                <div class="input-group mb-3">
                                    <span class="input-affix-wrapper">
                                    <input type="text" class="form-control" placeholder="Select employees" aria-label="Username" aria-describedby="basic-addon1" id="audit-out-form-employee-data">
                                    
                                    <div class="row"></div>
                                    
                                    <span class="input-suffix"><i class="fa fa-user" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight"
                                        aria-controls="offcanvasExample"></i></span>
                                    <div
                                    class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight"
                                    aria-labelledby="offcanvasTopLabel"
                                    style="width: 50%; margin-top: 4em;"
                            >
                                <div class="offcanvas-header">
                                    <h5 id="offcanvasRightLabel">Add Employee</h5>
                                </div>
                                <div class="offcanvas-body form-group">
                                    <table
                                            id="datable-audit-out-form-employee" class="table nowrap w-100 mb-5"
                                            data-url="{% url 'EmployeeListAPI' %}"
                                            data-method="GET"
                                    >
                                        <thead>
                                        <tr>
                                            <th>Code</th>
                                            <th>Full Name</th>
                                            <th>Username</th>
                                            <th>
                                                <span class="form-check">
                                                    <input
                                                            type="checkbox"
                                                            class="form-check-input check-select-all"
                                                            id="customCheck1"
                                                    >
                                                    <label class="form-check-label" for="customCheck1"></label>
                                                </span>
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        </tbody>
                                    </table>
                                    <br><br>
                                    <div class="row">
                                        <div class="col-8"></div>
                                        <div
                                                class="col-2" data-bs-dismiss="offcanvas"
                                                aria-label="Close" style="padding-left: 70px"
                                        >
                                            <span
                                                    class="btn btn-primary" id="button-add-audit-out-form-employee"
                                            >Add</span>
                                        </div>
                                        <div
                                                class="col-2" data-bs-dismiss="offcanvas"
                                                aria-label="Close"
                                        >
                                            <span class="btn btn-light">Cancel</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                                    </span>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Editing zone</label>
                                <select
                                        class="form-select" 
                                        id="select-box-audit-option"
                                >
                                    <option></option>
                                    <option>In form</option>
                                    <option>Out form</option>
                                    <option>In workflow</option>
                                </select>
                            </div>`)
        $('#select-box-audit-option').val("1");
        loadAuditOutFormEmployee()
    } else {
        modalBody[0].innerHTML = "";
        modalBody.append(defaultEle);
        modalBody.append(`<div class="form-group">
                                <label class="form-label">Select field in form</label>
                                <select
                                        class="form-select" 
                                        id="select-box-audit-option"
                                >
                                    <option></option>
                                    <option>In form</option>
                                    <option>Out form</option>
                                    <option>In workflow</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Editing zone</label>
                                <select
                                        class="form-select" 
                                        id="select-box-audit-option"
                                >
                                    <option></option>
                                    <option>In form</option>
                                    <option>Out form</option>
                                    <option>In workflow</option>
                                </select>
                            </div>`)
        $('#select-box-audit-option').val("2");
    }

    return false;
});


// Action on add canvas employee
$(document).on('click', '#button-add-audit-out-form-employee', function () {
    tableAuditOutFormEmployeeAdd()
});


function tableAuditOutFormEmployeeAdd() {
    let employeeIDList = [];
    let dataShow = ``;
    let spanGroup = ``;
    let auditOutFormEmployeeEle = document.getElementById("audit-out-form-employee-data");
    let auditOutFormEmployeeShow = auditOutFormEmployeeEle.nextElementSibling;

    let table = $('#datable-audit-out-form-employee').DataTable();
    let dataCheckedIndexes = table.rows('.selected').indexes();
    let trSTT = 0;
    for (let idx = 0; idx < dataCheckedIndexes.length; idx++) {
        let dataChecked = table.rows(dataCheckedIndexes[idx]).data()[0];
        let childID = dataChecked.id;
        let childTitle = dataChecked.full_name;
        trSTT++;
        employeeIDList.push(childID);

        if (trSTT !== 0 && trSTT % 5 === 0) {
            spanGroup += `<span class="badge badge-soft-primary mt-1 ml-1">${childTitle}</span>`
            dataShow += `<div class="col-8">${spanGroup}</div>`
            spanGroup = ``
        } else {
            if (trSTT === dataCheckedIndexes.length) {
                spanGroup += `<span class="badge badge-soft-primary mt-1 ml-1">${childTitle}</span>`
                dataShow += `<div class="col-8">${spanGroup}</div>`
            } else {
                spanGroup += `<span class="badge badge-soft-primary mt-1 ml-1">${childTitle}</span>`
            }
        }
    }
    auditOutFormEmployeeEle.value = employeeIDList;
    auditOutFormEmployeeEle.setAttribute("hidden", true);
    auditOutFormEmployeeShow.innerHTML = "";
    auditOutFormEmployeeShow.innerHTML = dataShow

    return false;
}


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
    let table = $('#datable-audit-out-form-employee').DataTable();
    let indexList = table.rows().indexes();
    if ($(this).is(":checked")) {
        for (let idx = 0; idx < indexList.length; idx++) {
            let rowNode = table.rows(indexList[idx]).nodes()[0];
            rowNode.classList.add('selected');
            rowNode.lastElementChild.children[0].firstElementChild.checked = true;
        }
        $('.check-select').prop('checked', true);
    } else {
        for (let idx = 0; idx < indexList.length; idx++) {
            let rowNode = table.rows(indexList[idx]).nodes()[0];
            rowNode.classList.remove("selected");
            rowNode.lastElementChild.children[0].firstElementChild.checked = false;
        }
        $('.check-select').prop('checked', false);
    }
});