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
                                        <td>
                                        <div class="btn-group dropdown">
                                        <i class="fas fa-align-justify" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="color: #cccccc"><span class="check-done-audit" style="padding-left: 255px"><i class="fas fa-check" style="color: #00D67F; font-size: 20px"></i></span></i>
                                            <div class="dropdown-menu w-250p"><div class="h-250p"><div data-simplebar class="nicescroll-bar">
                                                <ul class="node-action-list p-0">
                                                    ${actionEle}
                                                </ul>
                                            </div>
                                            </div>
                                            </div>
                                        </div>
                                        </td>
                                        <td>
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
                                                                    <th>Collaborator</th>
                                                                    <th>Position</th>
                                                                    <th>Role</th>
                                                                    <th>Editing Zone</th>
                                                                    <th>Actions</th>
                                                                </tr>
                                                                </thead>
                                                                <tbody>
                                                                <td>Creator</td>
                                                                <td>Creator's position</td>
                                                                <td>Creator's role</td>
                                                                <td>Creator's role</td>
                                                                <td><a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Edit" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></span></span></a></td>
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
                                            <span class="check-done-audit" style="padding-left: 255px"><i class="fas fa-check" style="color: #00D67F; font-size: 20px"></i></span>
                                        </td>
                                        <td>${actionData}</td></tr>`
                            } else {
                                nodeHTML = `<tr class="${initialRow}" data-initial-check-box="${initialCheckBox}"><td>${checkBox}</td><td><span>${title}</span></td><td><span>${description}</span></td>
                                                                <td><i class="fas fa-align-justify" style="color: #cccccc"><span class="check-done-audit" style="padding-left: 255px"><i class="fas fa-check" style="color: #00D67F; font-size: 20px"></i></span></i></td>
                                                                <td><i class="fas fa-align-justify" style="color: #cccccc"><span class="check-done-audit" style="padding-left: 260px"><i class="fas fa-check" style="color: #00D67F; font-size: 20px"></i></span></i></td>
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


$(document).on('click', '.next-btn', function (e) {
    let table = $('#datable-workflow-node-create').DataTable();
    table.columns.adjust();
});



function loadAuditOutFormEmployee (tableId) {
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
        let Id = "#" + tableId;
        let dtb = $(Id);
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
        let Id = "#" + tableId;
        let tb = $(Id);
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
    let initialCheckBox = initialRow[0].getAttribute('data-initial-check-box');
    let newCheckBox = String(Number(initialCheckBox) + 1);

    let currentId = "chk_sel_" + newCheckBox;
    let checkBox = `<span class="form-check mb-0"><input type="checkbox" class="form-check-input check-select check-add-group-employee" id="${currentId}"><label class="form-check-label" for="${currentId}"></label></span>`;
    let nodeName = $('#modal-node-name-create').val();
    let nodeDescription = $('#modal-node-description-create').val();
    let bt2 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Edit" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></span></span></a>`;
    let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover workflow-node-del-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></span></span></a>`;
    let actionData = bt2 + bt3;
    let actionEle = ``;
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
    let modalAuditId = "auditModalCreate" + newCheckBox

    initialRow.after(`<tr class="initial-row" data-initial-check-box="${newCheckBox}"><td>${checkBox}</td><td><span>${nodeName}</span></td><td><span>${nodeDescription}</span></td>
                                    <td>
                                        <div class="btn-group dropdown">
                                        <i class="fas fa-align-justify" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="check-done-action" style="padding-left: 255px"><i class="fas fa-times" style="color: red; font-size: 20px"></i></span></i>
                                            <div class="dropdown-menu w-250p"><div class="h-250p"><div data-simplebar class="nicescroll-bar">
                                                <ul class="node-action-list p-0">
                                                    ${actionEle}
                                                </ul>
                                            </div>
                                            </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                    <i class="fas fa-align-justify" data-bs-toggle="modal" data-bs-target="#${modalAuditId}"></i>
                                        <div
                                            class="modal fade" id="${modalAuditId}" tabindex="-1" role="dialog"
                                            aria-labelledby="exampleModalCenter" aria-hidden="true"
                                        >
                                            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                                                <div class="modal-content">
                                                    <div class="modal-header">
                                                        <h5 class="modal-title">Add Collaborator</h5>
                                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                                            <span aria-hidden="true">&times;</span>
                                                        </button>
                                                    </div>
                                                    <div class="modal-body">
                                                        <div class="form-group">
                                                            <label class="form-label">List source</label>
                                                            <select
                                                                    class="form-select select-box-audit-option" 
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
                                        <span class="check-done-audit" style="padding-left: 255px"><i class="fas fa-times" style="color: red; font-size: 20px"</span>
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
$(document).on('change', '.select-box-audit-option', function (e) {
    let eleTrOrder = $(this)[0].closest('tr').getAttribute('data-initial-check-box');
    let tableOutFormEmployeeId = "datable-audit-out-form-employee-" + eleTrOrder;
    let tableInWorkflowEmployeeId = "datable-audit-in-workflow-employee-" + eleTrOrder;
    let boxInWorkflowEmployeeId = "select-box-audit-in-workflow-employee-" + eleTrOrder;
    let boxInWorkflowCompanyId = "select-box-audit-in-workflow-company-" + eleTrOrder;
    let canvasId = "offcanvasRight" + eleTrOrder;
    let canvasInWorkflowId = "offcanvasRightInWorkflow" + eleTrOrder;

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
    // init zone data
    let defaultZone = `<div class="form-group">
                                <label class="form-label">Editing zone</label>
                                <div class="input-group mb-3">
                                    <span class="input-affix-wrapper">
                                    <input type="text" class="form-control" placeholder="Select zone" aria-label="Username" aria-describedby="basic-addon1" disabled>
                                    <div class="row zone-data-show"></div>
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
                                            data-bs-target="#${canvasInWorkflowId}"
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
                                class="offcanvas offcanvas-end" tabindex="-1" id="${canvasInWorkflowId}"
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
                                                class="form-select select-box-audit-in-workflow-company" 
                                                id="${boxInWorkflowCompanyId}"
                                        >
                                            <option></option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Select employee</label>
                                        <select
                                                class="form-select select-box-audit-in-workflow-employee" 
                                                id="${boxInWorkflowEmployeeId}"
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
                                                aria-label="" style="padding-left: 70px"
                                        >
                                            <span
                                                    class="btn btn-primary button-add-audit-in-workflow-employee" id=""
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
                                    class="table nowrap w-100 mb-5 table-in-workflow-employee"
                                    id="${tableInWorkflowEmployeeId}"
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
    let value = $(this).val();
    if (value === "0") {
        modalBody[0].innerHTML = "";
        modalBody.append(`<div class="form-group">
                                <label class="form-label">List source</label>
                                <select
                                        class="form-select select-box-audit-option"
                                >
                                    <option></option>
                                    <option value="0" selected>In form</option>
                                    <option value="1">Out form</option>
                                    <option value="2">In workflow</option>
                                </select>
                            </div>`);
        modalBody.append(`<div class="form-group">
                                <label class="form-label">Select field in form</label>
                                <select
                                        class="form-select" 
                                >
                                    <option></option>
                                    <option>In form</option>
                                    <option>Out form</option>
                                    <option>In workflow</option>
                                </select>
                            </div>
                            ${defaultZone}`)
    } else if (value === "1") {
        modalBody[0].innerHTML = "";
        modalBody.append(`<div class="form-group">
                                <label class="form-label">List source</label>
                                <select
                                        class="form-select select-box-audit-option"
                                >
                                    <option></option>
                                    <option value="0">In form</option>
                                    <option value="1" selected>Out form</option>
                                    <option value="2">In workflow</option>
                                </select>
                            </div>`);
        modalBody.append(`<div class="form-group">
                                <label class="form-label">Employee list</label>
                                <div class="input-group mb-3">
                                    <span class="input-affix-wrapper">
                                    <input type="text" class="form-control" placeholder="Select employees" aria-label="Username" aria-describedby="basic-addon1" disabled>
                                    
                                    <div class="row audit-out-form-employee-data-show"></div>
                                    
                                    <span class="input-suffix"><i class="fa fa-user" data-bs-toggle="offcanvas" data-bs-target="#${canvasId}"
                                        aria-controls="offcanvasExample"></i></span>
                                    <div
                                    class="offcanvas offcanvas-end" tabindex="-1" id="${canvasId}"
                                    aria-labelledby="offcanvasTopLabel"
                                    style="width: 50%; margin-top: 4em;"
                            >
                                <div class="offcanvas-header">
                                    <h5 id="offcanvasRightLabel">Add Employee</h5>
                                </div>
                                <div class="offcanvas-body form-group">
                                    <table
                                            id="${tableOutFormEmployeeId}" class="table nowrap w-100 mb-5 table-out-form-employee"
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
                                                    class="btn btn-primary button-add-audit-out-form-employee" id=""
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
        loadAuditOutFormEmployee(tableOutFormEmployeeId);
    } else {
        modalBody[0].innerHTML = "";
        modalBody.append(`<div class="form-group">
                                <label class="form-label">List source</label>
                                <select
                                        class="form-select select-box-audit-option"
                                >
                                    <option></option>
                                    <option value="0">In form</option>
                                    <option value="1">Out form</option>
                                    <option value="2" selected>In workflow</option>
                                </select>
                            </div>`);
        modalBody.append(tableEmployeeInWorkflow)
        loadCompanyAuditInWorkflow(boxInWorkflowCompanyId);
        loadEmployeeAuditInWorkflow(boxInWorkflowEmployeeId);
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


function loadCompanyAuditInWorkflow(boxId) {
    let url = '/company/list/api';
    let method = "GET"
    let jqueryId = "#" + boxId
    let ele = $(jqueryId);
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


function loadEmployeeAuditInWorkflow(boxId) {
    let url = '/hr/employee/api';
    let method = "GET"
    let jqueryId = "#" + boxId
    let ele = $(jqueryId);
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
$(document).on('click', '.button-add-audit-out-form-employee', function () {
    let tableId = "#" + $(this)[0].closest('.modal-body').querySelector('.table-out-form-employee').id;
    let eleDivInputWrapper = $(this)[0].closest('.input-affix-wrapper');
    let eleTd = $(this)[0].closest('td');
    let eleSpan = eleTd.querySelector('.check-done-audit');
    if (eleDivInputWrapper.children.length > 1) {
        let auditOutFormEmployeeEle = eleDivInputWrapper.children[0];
        let auditOutFormEmployeeShow = eleDivInputWrapper.children[1];
        let employeeIDList = [];
        let dataShow = ``;
        let spanGroup = ``;

        let table = $(tableId).DataTable();
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
        if (dataShow) {
            eleSpan.innerHTML = ``;
            eleSpan.innerHTML = `<i class="fas fa-check" style="color: #00D67F; font-size: 20px"></i>`;
        }
    }
});


// On click button add Employee Audit In Workflow
$(document).on('click', '.button-add-audit-in-workflow-employee', function () {
    let tableId = $(this)[0].closest('.modal-body').querySelector('.table-in-workflow-employee').id;
    let jqueryId = "#" + tableId;
    let table = $(jqueryId);
    let tableLen = document.getElementById(tableId).tBodies[0].rows.length;
    let companySelectBox = document.getElementById($(this)[0].closest('.offcanvas-body').querySelector('.select-box-audit-in-workflow-company').id);
    let companySelected = companySelectBox.options[companySelectBox.selectedIndex];
    let employeeBoxId = $(this)[0].closest('.offcanvas-body').querySelector('.select-box-audit-in-workflow-employee').id;
    let employeeVal = $(this)[0].closest('.offcanvas-body').querySelector('.select-box-audit-in-workflow-employee').value;
    let empSelectBox = document.getElementById(employeeBoxId);
    let empSelected = empSelectBox.options[empSelectBox.selectedIndex];
    let empTitle = empSelected.text;
    let empRole = ``;
    let eleTd = $(this)[0].closest('td');
    let eleSpan = eleTd.querySelector('.check-done-audit');
    if (empSelected.innerHTML) {
        empRole = empSelected.nextElementSibling.innerHTML;
    }
    let zone = empSelectBox.closest('div').nextElementSibling.querySelector('.zone-data-show');
    let zoneInput = zone.previousElementSibling;
    let zoneDataList = zone.nextElementSibling.querySelector('.node-zone-list');
    let zoneShowLen = 0;
    let trSTT = 0;
    let spanGroup = ``;
    let dataZoneShow = ``;
    if (zone.children.length > 0) {
        for (let d = 0; d < zone.children.length; d++) {
            zoneShowLen += zone.children[d].children.length;
        }
    }
    if (zone.children.length > 0) {
        for (let d = 0; d < zone.children.length; d++) {
            for (let z = 0; z < zone.children[d].children.length; z++) {
                trSTT++
                let spanData = zone.children[d].children[z].innerHTML;
                if (trSTT !== 0 && trSTT % 2 === 0) {
                    spanGroup += `<span class="badge badge-soft-primary mt-1 ml-1">${spanData}</span>`
                    dataZoneShow += `<div class="col-12" style="margin-left: -18px">${spanGroup}</div>`
                    spanGroup = ``
                } else {
                    if (trSTT === zoneShowLen) {
                        spanGroup += `<span class="badge badge-soft-primary mt-1 ml-1">${spanData}</span>`
                        dataZoneShow += `<div class="col-12" style="margin-left: -18px">${spanGroup}</div>`
                    } else {
                        spanGroup += `<span class="badge badge-soft-primary mt-1 ml-1">${spanData}</span>`
                    }
                }
            }
        }
    }

    let currentId = "chk_sel_" + String(tableLen + 1)
    let checkBox = `<span class="form-check mb-0"><input type="checkbox" class="form-check-input check-select check-add-group-employee" id="${currentId}"><label class="form-check-label" for="${currentId}"></label></span>`;
    let bt2 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Edit" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></span></span></a>`;
    let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover audit-in-workflow-del-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></span></span></a>`;
    let actionData = bt2 + bt3;

    if (empTitle) {
        table.append(`<tr><td>${checkBox}</td><td>${empTitle}<input class="data-in-workflow-employee" type="text" value="${employeeVal}" hidden></td><td></td><td>${empRole}</td><td class="data-in-workflow-zone">${dataZoneShow}</td><td>${actionData}</td></tr>`)
        if (tableLen === 0) {
            eleSpan.innerHTML = ``;
            eleSpan.innerHTML = `<i class="fas fa-check" style="color: #00D67F; font-size: 20px"></i>`;
        }
    }

    // reset canvas
    companySelected.selected = false;
    empSelected.selected = false;
    zone.innerHTML = ``;

    zoneInput.removeAttribute('hidden');
    zone.classList.remove("col-11");
    zone.classList.add("row");
    zone.style.removeProperty('margin-right');
    if (zoneDataList.children.length > 0) {
        for (let li = 0; li < zoneDataList.children.length; li++) {
            if (zoneDataList.children[li].children.length > 1) {
                let input = zoneDataList.children[li].children[1].children[0];
                input.checked = false;
            }
        }
    }
});


// On check zone of node to change status
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
                dataShow += `<div class="col-12" style="margin-left: -30px">${spanGroup}</div>`
                spanGroup = ``
            } else {
                if (trSTT === dataChecked) {
                    spanGroup += `<span class="badge badge-soft-primary mt-1 ml-1">${childTitle}<input type="text" value="${childID}" hidden></span>`
                    dataShow += `<div class="col-12" style="margin-left: -30px">${spanGroup}</div>`
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
    // let eleSpan = eleTd.children[0].children[0].children[0];
    let eleSpan = eleTd.querySelector('.check-done-action');
    let eleUL = $(this)[0].closest('ul');

    // checked
    if ($(this)[0].checked === true) {
        eleSpan.innerHTML = ``;
        eleSpan.innerHTML = `<i class="fas fa-check" style="color: #00D67F; font-size: 20px"></i>`;
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
            eleSpan.innerHTML = ``;
            eleSpan.innerHTML = `<i class="fas fa-times" style="color: red; font-size: 20px"></i>`;
        }
    }
});


// function setupDataNode() {
//     let dataNodeList = [];
//     let tableNode = document.getElementById('datable-workflow-node-create');
//     for (let idx = 0; idx < tableNode.tBodies[0].rows.length; idx++) {
//         let title = "";
//         let description = "";
//         let dataNode = {};
//         let dataActionList = [];
//         let dataEmployeeList = [];
//         let dataZoneList = [];
//         let dataCollaboratorList = [];
//         let row = tableNode.rows[idx+1];
//         let rowChildren = row.children;
//         for (let d = 0; d < rowChildren.length; d++) {
//             let col = rowChildren[d + 1];
//             if ((d + 1) === 1) {
//                 title = col.children[0].innerHTML;
//             } else if ((d + 1) === 2) {
//                 description = col.children[0].innerHTML;
//             } else if ((d + 1) === 3) {
//                 // set data workflow node actions submit
//                 let eleUL = col.querySelector('.node-action-list');
//                 if (eleUL) {
//                     for (let li = 0; li < eleUL.children.length; li++) {
//                         let eleInput = eleUL.children[li].children[1].children[0];
//                         let eleDataInput = eleUL.children[li].children[0].children[0].children[0].children[0];
//                         if (eleInput.checked === true) {
//                             if (eleDataInput.getAttribute('data-action')) {
//                                 dataActionList.push(Number(eleDataInput.getAttribute('data-action')));
//                             }
//                         }
//                     }
//                 }
//                 dataNode['actions'] = dataActionList;
//             } else if ((d + 1) === 4) {
//                 // set data workflow node collaborator submit
//                 let modalBody = col.querySelector('.modal-body');
//                 if (modalBody) {
//                     if (modalBody.children[0].children[1].value) {
//                         let optionCollab = Number(modalBody.children[0].children[1].value);
//                         dataNode['option_collaborator'] = optionCollab;
//
//                         // if option audit === 1
//                         if (optionCollab === 1) {
//                             let auditOutFormEmployeeEle = modalBody.querySelector('.audit-out-form-employee-data-show');
//                             let eleDiv = auditOutFormEmployeeEle.children;
//                             if (eleDiv.length > 0) {
//                                 for (let d = 0; d < eleDiv.length; d++) {
//                                     let auditOutFormEmployeeShow = eleDiv[d].children;
//                                     for (let s = 0; s < auditOutFormEmployeeShow.length; s++) {
//                                         let empID = auditOutFormEmployeeShow[s].children[0].value;
//                                         dataEmployeeList.push(empID);
//                                     }
//                                 }
//                             }
//                             dataNode['employee_list'] = dataEmployeeList
//                             let zone = modalBody.children[2].querySelector('.zone-data-show');
//                             if (zone.children.length > 0) {
//                                 for (let d = 0; d < zone.children.length; d++) {
//                                     if (zone.children[d].children.length > 0) {
//                                         for (let z = 0; z < zone.children[d].children.length; z++) {
//                                             dataZoneList.push(Number(zone.children[d].children[z].children[0].value));
//                                         }
//                                     }
//                                 }
//                             }
//                             dataNode['node_zone'] = dataZoneList;
//
//                         } else if (optionCollab === 2) {
//                             let tableDataShowId = modalBody.querySelector('.table-in-workflow-employee').id;
//                             let table = document.getElementById(tableDataShowId);
//                             for (let r = 0; r < table.tBodies[0].rows.length; r++) {
//                                 let dataCollaborator = {};
//                                 let dataZoneInWorkflowList = []
//                                 let row = table.rows[r+1];
//                                 let employee = row.querySelector('.data-in-workflow-employee').value;
//                                 dataCollaborator['employee'] = employee;
//
//                                 let zoneTd = row.querySelector('.data-in-workflow-zone');
//                                 if (zoneTd.children.length > 0) {
//                                     for (let col = 0; col < zoneTd.children.length; col++) {
//                                         if (zoneTd.children[col].children.length > 0) {
//                                             for (let s = 0; s < zoneTd.children[col].children.length; s++) {
//                                                 let zoneVal = zoneTd.children[col].children[s].children[0].value;
//                                                 dataZoneInWorkflowList.push(Number(zoneVal))
//                                             }
//                                         }
//                                     }
//                                     dataCollaborator['zone'] = dataZoneInWorkflowList;
//                                 }
//                                 dataCollaboratorList.push({
//                                     'employee': employee,
//                                     'zone': dataZoneInWorkflowList,
//                                 });
//                             }
//                             dataNode['collaborator'] = dataCollaboratorList;
//                         }
//                     }
//                 }
//             }
//         }
//         dataNodeList.push({
//                 'title': title,
//                 'description': description,
//                 'actions': dataActionList,
//                 'employee_list': dataEmployeeList,
//                 'node_zone': dataZoneList,
//                 'collaborator': dataCollaboratorList
//             });
//     }
// }
