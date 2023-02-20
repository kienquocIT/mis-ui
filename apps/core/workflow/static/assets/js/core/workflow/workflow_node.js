$(document).ready(function () {
    function loadSystemNode() {
        let url = '/workflow/node/system';
        let method = "GET"
        let ele = $('#datable-workflow-node-create tbody');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('node_system') && Array.isArray(data.node_system)) {
                        ele.empty();
                        let nodeAction = [{"0": "Create"}, {"1": "Approve"}, {"2": "Reject"}, {"3": "Return"}, {"4": "Receive"}, {"5": "To do"}]
                        let actionEle = ``;
                        let inputEle = ``;
                        let tableLen = 1;
                        for (let a = 0; a < nodeAction.length; a++) {
                            for (let key in nodeAction[a]) {
                                if (key === "0") {
                                    inputEle = `<input type="checkbox" className="check-action-node" id="customCheck6" checked disabled>`;
                                } else {
                                    inputEle = `<input type="checkbox" className="check-action-node" id="customCheck6" disabled>`;
                                }
                                actionEle += `<li class="d-flex align-items-center justify-content-between mb-3">
                                                <div class="media d-flex align-items-center">
                                                <div class="media-body">
                                                <div>
                                                <div class="node-action" data-action="${key}">${nodeAction[a][key]}</div>
                                                </div>
                                                </div>
                                                </div>
                                                <div class="form-check form-check-theme ms-3">
                                                ${inputEle}
                                                <label class="form-check-label" for="customCheck6"></label>
                                                </div>
                                            </li>`
                            }
                        }
                        let bt2 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Edit" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit" style="color: #cccccc"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></span></span></a>`;
                        let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2" style="color: #cccccc"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></span></span></a>`;
                        let actionData = bt2 + bt3;
                        data.node_system.map(function (item) {
                            let nodeHTML = ``;
                            let initialRow = "";
                            let initialCheckBox = "";
                            let title = "";
                            let description = "";
                            if (item.title !== null) {
                                title = item.title
                            }
                            if (item.remark !== null) {
                                description = item.remark
                            }
                            let currentId = "";
                            let checkBox = `<span class="form-check mb-0"><input type="checkbox" class="form-check-input check-select check-add-workflow-node" id="${currentId}"><label class="form-check-label" for="${currentId}"></label></span>`;

                            if (item.order === 1) {
                                initialRow = "initial-row"
                                initialCheckBox = "1"
                                currentId = "check_sel_1";
                                checkBox = `<span class="form-check mb-0"><input type="checkbox" class="form-check-input check-select check-add-workflow-node" id="${currentId}"><label class="form-check-label" for="${currentId}"></label></span>`;
                                nodeHTML = `<tr class="${initialRow}" data-initial-check-box="${initialCheckBox}"><td>${checkBox}</td><td><span>${title}</span></td><td><span>${description}</span></td>
                                        <td style="background-color: #ebf9ff">
                                        <div class="btn-group dropdown">
                                        <i class="fas fa-align-justify" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="color: #cccccc"></i>
                                            <div class="dropdown-menu w-250p"><div class="h-250p"><div data-simplebar class="nicescroll-bar">
                                                <ul class="node-action-list p-0">
                                                    ${actionEle}
                                                </ul>
                                            </div>
                                            </div>
                                            </div>
                                        </div>
                                        </td>
                                        <td style="background-color: #ebf9ff">
                                        <i class="fas fa-align-justify" data-bs-toggle="modal" data-bs-target="#auditModalCreateInitial"></i>
                                        <div
                                            class="modal fade" id="auditModalCreateInitial" tabindex="-1" role="dialog"
                                            aria-labelledby="exampleModalCenter" aria-hidden="true"
                                        >
                                                <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                                                    <div class="modal-content">
                                                        <div class="modal-header">
                                                            <h5 class="modal-title">Add Collaborators</h5>
                                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                                                <span aria-hidden="true">&times;</span>
                                                            </button>
                                                        </div>
                                                        <div class="modal-body">
                                                            <table
                                                                id=""
                                                                class="table nowrap w-100 mb-5"
                                                            >
                                                                <thead>
                                                                <tr>
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
                                                                    <th>Collaborator</th>
                                                                    <th>Position</th>
                                                                    <th>Role</th>
                                                                    <th>Editing Zone</th>
                                                                    <th>Actions</th>
                                                                </tr>
                                                                </thead>
                                                                <tbody>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                        <div class="modal-footer">
                                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" id="btn-add-audit-create">Save changes</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>${actionData}</td></tr>`
                            } else {
                                nodeHTML = `<tr class="${initialRow}" data-initial-check-box="${initialCheckBox}"><td>${checkBox}</td><td><span>${title}</span></td><td><span>${description}</span></td>
                                                                <td style="background-color: #ebf9ff"><i class="fas fa-align-justify" style="color: #cccccc"></i></td>
                                                                <td style="background-color: #ebf9ff"><i class="fas fa-align-justify" style="color: #cccccc"></i></td>
                                                                <td>${actionData}</td>
                                                            </tr>`
                            }

                            ele.append(nodeHTML)
                        })
                    }
                }
            }
        )
    }

    loadSystemNode()
});


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
    // let initialRow = $('#datable-workflow-node-create > tbody > tr').eq(0);
    let initialRow = tableShowBodyOffModal.find('.initial-row');
    let initialCheckBox = tableShowBodyOffModal[0].children[0].getAttribute('data-initial-check-box');
    let newCheckBox = String(Number(initialCheckBox) + 1);

    let currentId = "chk_sel_" + newCheckBox;
    let checkBox = `<span class="form-check mb-0"><input type="checkbox" class="form-check-input check-select check-add-group-employee" id="${currentId}"><label class="form-check-label" for="${currentId}"></label></span>`;
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
            <input type="checkbox" class="form-check-input check-action-node" id="customCheck6">
            <label class="form-check-label" for="customCheck6"></label>
            </div>
            </li>`
        }
    }

    initialRow.after(`<tr class="initial-row" data-initial-check-box="${newCheckBox}"><td>${checkBox}</td><td><span>${nodeName}</span></td><td><span>${nodeDescription}</span></td>
                                    <td style="background-color: #fffdeb">
                                        <div class="btn-group dropdown">
                                        <i class="fas fa-align-justify" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span style="padding-left: 20px">(select to done)</span></i>
                                            <div class="dropdown-menu w-250p"><div class="h-250p"><div data-simplebar class="nicescroll-bar">
                                                <ul class="node-action-list p-0">
                                                    ${actionEle}
                                                </ul>
                                            </div>
                                            </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style="background-color: #fffdeb">
                                    <i class="fas fa-align-justify" data-bs-toggle="modal" data-bs-target="#auditModalCreate"><span style="padding-left: 20px">(select to done)</span></i>
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
                                        <input type="text" class="workflow-node-audit-submit" hidden>
                                    </td>
                                    <td>${actionData}</td></tr>`);

    initialRow.removeClass('initial-row');
    return false;
}


// Action on delete row node
$(document).on('click', '.workflow-node-del-button', function (e) {
    let currentRow = $(this).closest('tr')
    currentRow.remove();

    return false;
});


// Action on delete row audit employee in workflow
$(document).on('click', '.audit-in-workflow-del-button', function (e) {
    let currentRow = $(this).closest('tr')
    currentRow.remove();

    return false;
});


// Action on change audit option
$(document).on('change', '#select-box-audit-option', function (e) {
    let tableZone = document.getElementById('table_workflow_zone');
    let optionZone = ``;
    let orderNum = 0;
    for (let z = 0; z < tableZone.tBodies[0].rows.length; z++) {
        let row = tableZone.rows[z+1];
        if (row.children[1]) {
            let childTitle = row.children[1].children[0].innerHTML;
            orderNum++;
            optionZone += `<li class="d-flex align-items-center justify-content-between mb-3">
            <div class="media d-flex align-items-center">
            <div class="media-body">
            <div>
            <div class="node-zone" data-node-zone="${orderNum}">${childTitle}</div>
            </div>
            </div>
            </div>
            <div class="form-check form-check-theme ms-3">
            <input type="checkbox" class="form-check-input check-zone-node" id="customCheck6">
            <label class="form-check-label" for="customCheck6"></label>
            </div>
            </li>`
        }
    }
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
    // init zone data
    let defaultZone = `<div class="form-group">
                                <label class="form-label">Editing zone</label>
                                <div class="input-group mb-3">
                                    <span class="input-affix-wrapper">
                                    <input type="text" class="form-control zone-data-show" placeholder="Select zone" aria-label="Username" aria-describedby="basic-addon1" disabled>
                                    <div class="row"></div>
                                    <div class="btn-group dropdown">
                                        <i class="fas fa-align-justify" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
                                            <div class="dropdown-menu w-250p"><div class="h-250p"><div data-simplebar class="nicescroll-bar">
                                                <ul class="node-zone-list p-0">
                                                    ${optionZone}
                                                </ul>
                                            </div>
                                            </div>
                                            </div>
                                        </div>
                                    </span>
                                </div>
                            </div>`

    // init for option 3
    let tableEmployeeInWorkflow = `
                                    <button
                                            type="button"
                                            class="btn btn-flush-success flush-soft-hover"
                                            data-bs-toggle="offcanvas" 
                                            data-bs-target="#offcanvasRightAuditInWork"
                                            aria-controls="offcanvasExample"
                                            style="font-size: 60%"
                                    >
                                        <span class="icon">
                                            <span class="feather-icon">
                                                <i class="fas fa-plus"></i>
                                            </span>
                                            <span class="font-3 ml-1">
                                                Add new employee
                                            </span>
                                        </span>
                                    </button>
                            <div
                                class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRightAuditInWork"
                                aria-labelledby="offcanvasTopLabel"
                                style="width: 50%; margin-top: 4em;"
                            >
                                <div class="offcanvas-header">
                                    <h5 id="offcanvasRightLabel">Add Employee</h5>
                                </div>
                                <div class="offcanvas-body form-group">
                                    <div class="form-group">
                                        <label class="form-label">Select company</label>
                                        <select
                                                class="form-select" 
                                                id="select-box-audit-in-workflow-company"
                                        >
                                            <option></option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Select employee</label>
                                        <select
                                                class="form-select" 
                                                id="select-box-audit-in-workflow-employee"
                                        >
                                            <option></option>
                                        </select>
                                    </div>
                                    ${defaultZone}
                                    <div class="form-group">
                                        <label class="form-label">
                                            Description
                                        </label>
                                        <textarea
                                                class="form-control"
                                                rows="4" cols="50"
                                        >
                                        </textarea>
                                        <span class="form-text text-muted">Description what to do</span>
                                    </div>
                                    <br><br>
                                    <div class="row">
                                        <div class="col-8"></div>
                                        <div
                                                class="col-2" data-bs-dismiss="offcanvas"
                                                aria-label="Close" style="padding-left: 70px"
                                        >
                                            <span
                                                    class="btn btn-primary" id="button-add-audit-in-workflow-employee"
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
                                <table
                                    id="datable-audit-in-workflow"
                                    class="table nowrap w-100 mb-5"
                                >
                                    <thead>
                                    <tr>
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
                                        <th>Collaborator</th>
                                        <th>Position</th>
                                        <th>Role</th>
                                        <th>Editing Zone</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>`

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
                            ${defaultZone}`)
        $('#select-box-audit-option').val("0");
    } else if (value === "1") {
        modalBody[0].innerHTML = "";
        modalBody.append(defaultEle);
        modalBody.append(`<div class="form-group">
                                <label class="form-label">Employee list</label>
                                <div class="input-group mb-3">
                                    <span class="input-affix-wrapper">
                                    <input type="text" class="form-control" placeholder="Select employees" aria-label="Username" aria-describedby="basic-addon1" id="audit-out-form-employee-data" disabled>
                                    
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
                                            <th></th>
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
                            
                            ${defaultZone}`)
        $('#select-box-audit-option').val("1");
        loadAuditOutFormEmployee();
    } else {
        modalBody[0].innerHTML = "";
        modalBody.append(defaultEle);
        modalBody.append(tableEmployeeInWorkflow)
        $('#select-box-audit-option').val("2");
        loadCompanyAuditInWorkflow();
        loadEmployeeAuditInWorkflow();
    }

    return false;
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


function loadCompanyAuditInWorkflow() {
    let url = '/company/list/api';
    let method = "GET"
    let ele = $('#select-box-audit-in-workflow-company');
    $.fn.callAjax(url, method).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (data.hasOwnProperty('company_list') && Array.isArray(data.company_list)) {
                    data.company_list.map(function (item) {
                        ele.append(`<option value="${item.id}">${item.title}</option>`)
                    })
                }
            }
        }
    )
}


function loadEmployeeAuditInWorkflow() {
    let url = '/hr/employee/api';
    let method = "GET"
    let ele = $('#select-box-audit-in-workflow-employee');
    $.fn.callAjax(url, method).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (data.hasOwnProperty('employee_list') && Array.isArray(data.employee_list)) {
                    data.employee_list.map(function (item) {
                        let spanRole = ``;
                        if (item.role && Array.isArray(item.role)) {
                            for (let r = 0; r < item.role.length; r++) {
                                spanRole += `<span class="badge badge-soft-primary">${item.role[r].title}</span>`
                            }
                        }
                        ele.append(`<option value="${item.id}" data-role="">${item.full_name}</option>
                                    <div hidden>${spanRole}</div>
                                    `)
                    })
                }
            }
        }
    )
}


// Action on add canvas employee out form
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
            spanGroup += `<span class="badge badge-soft-primary mt-1 ml-1">${childTitle}<input type="text" value="${childID}" hidden></span>`
            dataShow += `<div class="col-8">${spanGroup}</div>`
            spanGroup = ``
        } else {
            if (trSTT === dataCheckedIndexes.length) {
                spanGroup += `<span class="badge badge-soft-primary mt-1 ml-1">${childTitle}<input type="text" value="${childID}" hidden></span>`
                dataShow += `<div class="col-8">${spanGroup}</div>`
            } else {
                spanGroup += `<span class="badge badge-soft-primary mt-1 ml-1">${childTitle}<input type="text" value="${childID}" hidden></span>`
            }
        }
    }
    auditOutFormEmployeeEle.value = employeeIDList;
    auditOutFormEmployeeEle.setAttribute("hidden", true);
    auditOutFormEmployeeShow.innerHTML = "";
    auditOutFormEmployeeShow.innerHTML = dataShow

    return false;
}


// On click button add Employee Audit In Workflow
$(document).on('click', '#button-add-audit-in-workflow-employee', function () {
    let employeeVal = $('#select-box-audit-in-workflow-employee').val();
    let empSelectBox = document.getElementById('select-box-audit-in-workflow-employee');
    let empSelected = empSelectBox.options[empSelectBox.selectedIndex];
    let empTitle = empSelected.text;
    let empRole = empSelected.nextElementSibling.innerHTML;
    let zone = $('#select-box-audit-in-workflow-zone').val();
    let zoneSelectBox = document.getElementById('select-box-audit-in-workflow-zone');
    let zoneSelected = zoneSelectBox.options[zoneSelectBox.selectedIndex];
    let zoneTitle = zoneSelected.text;
    let table = $('#datable-audit-in-workflow tbody');
    let tableLen = document.getElementById('datable-audit-in-workflow').tBodies[0].rows.length;
    let currentId = "chk_sel_" + String(tableLen + 1)
    let checkBox = `<span class="form-check mb-0"><input type="checkbox" class="form-check-input check-select check-add-group-employee" id="${currentId}"><label class="form-check-label" for="${currentId}"></label></span>`;
    let bt2 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Edit" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></span></span></a>`;
    let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover audit-in-workflow-del-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></span></span></a>`;
    let actionData = bt2 + bt3;

    table.append(`<tr><td>${checkBox}</td><td>${empTitle}</td><td></td><td>${empRole}</td><td>${zoneTitle}</td><td>${actionData}</td></tr>`)

});


// On check zone of node
$(document).on('click', '.check-zone-node', function (e) {
    let eleUL = $(this)[0].closest('ul');
    let dataShow = ``;
    let spanGroup = ``;
    let zoneEle = $(this)[0].closest('span');
    let zoneInput = zoneEle.children[0];
    let zoneShow = zoneEle.children[1];

    let trSTT = 0;
    let dataChecked = 0;
    for (let li = 0; li < eleUL.children.length; li++) {
        let eleInput = eleUL.children[li].children[1].children[0];
        if (eleInput.checked === true) {
            dataChecked++
        }
    }

    for (let li = 0; li < eleUL.children.length; li++) {
        let eleLi = eleUL.children[li];
        let eleDivData = eleLi.querySelector('.node-zone');
        let eleInput = eleUL.children[li].children[1].children[0];
        if (eleInput.checked === true) {
            let childID = eleDivData.getAttribute('data-node-zone');
            let childTitle = eleDivData.innerHTML;
            trSTT++;
            if (trSTT !== 0 && trSTT % 5 === 0) {
                spanGroup += `<span class="badge badge-soft-primary mt-1 ml-1">${childTitle}<input type="text" value="${childID}" hidden></span>`
                dataShow += `<div class="col-12">${spanGroup}</div>`
                spanGroup = ``
            } else {
                if (trSTT === dataChecked) {
                    spanGroup += `<span class="badge badge-soft-primary mt-1 ml-1">${childTitle}<input type="text" value="${childID}" hidden></span>`
                    dataShow += `<div class="col-12">${spanGroup}</div>`
                } else {
                    spanGroup += `<span class="badge badge-soft-primary mt-1 ml-1">${childTitle}<input type="text" value="${childID}" hidden></span>`
                }
            }
        }
    }

    zoneInput.setAttribute("hidden", true);
    zoneShow.innerHTML = "";
    zoneShow.innerHTML = dataShow;
    zoneShow.classList.remove("row");
    zoneShow.classList.add("col-11");
    zoneShow.style.marginRight = "38px"

});


// On check action node
$(document).on('click', '.check-action-node', function (e) {
    let eleTd = $(this)[0].closest('td');
    let eleSpan = eleTd.children[0].children[0].children[0];
    let eleUL = $(this)[0].closest('ul');

    // checked
    if ($(this)[0].checked === true) {
        eleTd.style.background = "#ebf9ff";
        eleSpan.innerHTML = ""

    }
    // unchecked
    else {
        let allUnCheck = 0;
        for (let li = 0; li < eleUL.children.length; li++) {
            let eleInput = eleUL.children[li].children[1].children[0];
            if (eleInput.checked === false) {
                allUnCheck++;
            }
        }
        if (allUnCheck === eleUL.children.length) {
            eleTd.style.background = "#fffdeb";
            eleSpan.innerHTML = "(select to done)"
        }
    }


    setupDataNode()
});


function setupDataNode() {
    let dataNodeList = [];
    let dataNode = {};
    let tableNode = document.getElementById('datable-workflow-node-create');
    for (let idx = 0; idx < tableNode.tBodies[0].rows.length; idx++) {
        let dataAction = [];
        let row = tableNode.rows[idx+2];
        let rowChildren = row.children;
        for (let d = 0; d < rowChildren.length; d++) {
            let col = rowChildren[d+1];
            if ((d+1) === 1) {
                dataNode['title'] = col.children[0].innerHTML;
            } else if ((d+1) === 2) {
                dataNode['description'] = col.children[0].innerHTML;
            } else if ((d+1) === 3) {
                // set data workflow node actions submit
                let eleUL = col.querySelector('.node-action-list');
                for (let li = 0; li < eleUL.children.length; li++) {
                        let eleInput = eleUL.children[li].children[1].children[0];
                        let eleDataInput = eleUL.children[li].children[0].children[0].children[0].children[0];
                        if (eleInput.checked === true) {
                            if (eleDataInput.getAttribute('data-action')) {
                                dataAction.push(Number(eleDataInput.getAttribute('data-action')));
                            }
                        }
                    }
                dataNode['actions'] = dataAction;
            } else if ((d+1) === 4) {
                // set data workflow node collaborator submit
                let modalBody = col.querySelector('.modal-body');
                if (modalBody.children[0].children[1].value) {
                    let optionCollab = Number(modalBody.children[0].children[1].value);
                    dataNode['option_collaborator'] = optionCollab;

                    if (optionCollab === 1) {
                        let dataEmployeeList = [];
                        let auditOutFormEmployeeEle = document.getElementById("audit-out-form-employee-data");
                        let auditOutFormEmployeeShow = auditOutFormEmployeeEle.nextElementSibling.children[0].children;
                        for (let s = 0; s < auditOutFormEmployeeShow.length; s++) {
                            let empID = auditOutFormEmployeeShow[s].children[0].value;
                            dataEmployeeList.push(empID);
                        }
                        dataNode['employee_list'] = dataEmployeeList
                        let zone = modalBody.children[2].children[1].value;
                        dataNode['zone'] = zone;

                    } else if (optionCollab === 2) {
                        let zone = modalBody.children[2].children[1].value;
                        let tmp = zone
                    }
                }
            }
        }
    }
}