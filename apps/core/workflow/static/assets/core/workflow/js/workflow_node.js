// Action load zone for initial node on click
function loadZoneInitialNode(e) {
    let tableNode = $('#datable-workflow-node-create');
    let button = tableNode[0].querySelector('.btn-initial-node-collaborator');
    let modalBody = button.closest('tr').querySelector('.modal-body');
    let zoneTd = modalBody.querySelector('.initial-node-collaborator-zone');
    let tableZone = document.getElementById('table_workflow_zone');
    let actionDropDown = ``;
    let optionZone = ``;
    let orderNum = 0;
    optionZone += `<li class="d-flex align-items-center justify-content-between mb-3">
                                <div class="media d-flex align-items-center">
                                    <div class="media-body">
                                        <div>
                                            <div class="node-zone" data-node-zone="all">All</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-check form-check-theme ms-3">
                                    <input type="checkbox" class="form-check-input check-zone-node" data-node-initial="true" checked>
                                    <label class="form-check-label"></label>
                                </div>
                            </li>`
    for (let z = 0; z < tableZone.tBodies[0].rows.length; z++) {
        let row = tableZone.rows[z + 1];
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
                                            <input type="checkbox" class="form-check-input check-zone-node" data-node-initial="true" checked>
                                            <label class="form-check-label"></label>
                                        </div>
                                    </li>`
        }
    }
    actionDropDown = `<div class="btn-group dropdown">
                                    <i class="fas fa-chevron-down" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
                                    <div class="dropdown-menu w-250p"><div class="h-250p"><div data-simplebar class="nicescroll-bar">
                                        <ul class="node-zone-list p-0">
                                            ${optionZone}
                                        </ul>
                                    </div>
                                    </div>
                                    </div>
                                </div>`
    zoneTd.innerHTML = `<div class="row"><div class="col-9"><span class="zone-node-initial-show">All</span></div><div class="col-3">${actionDropDown}</div></div>`
}

$(function () {

    function renderAction(is_system_node = true) {
        let actionEle = ``;
        let nodeActionRaw = $('#wf_action').text();
        if (nodeActionRaw) {
            let nodeAction = JSON.parse(nodeActionRaw);
            let inputEle = ``;
            if (is_system_node === true) {
                for (let key in nodeAction) {
                    if (String(key) === "0") {
                        inputEle = `<input type="checkbox" class="check-action-node" checked disabled>`;
                    } else {
                        inputEle = `<input type="checkbox" class="check-action-node" disabled>`;
                    }
                    actionEle += `<li class="d-flex align-items-center justify-content-between mb-3">
                            <div class="media d-flex align-items-center">
                                <div class="media-body">
                                    <div>
                                        <div class="node-action" data-action="${String(key)}">${nodeAction[key]}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="form-check form-check-theme ms-3">
                                ${inputEle}
                                <label class="form-check-label"></label>
                            </div>
                        </li>`
                }
            } else {
                for (let key in nodeAction) {
                    if (String(key) === "0") {
                        inputEle = `<input type="checkbox" class="form-check-input check-action-node" disabled>`
                    } else {
                        inputEle = `<input type="checkbox" class="form-check-input check-action-node">`;
                    }
                    actionEle += `<li class="d-flex align-items-center justify-content-between mb-3">
                            <div class="media d-flex align-items-center">
                                <div class="media-body">
                                    <div>
                                        <div class="node-action" data-action="${String(key)}">${nodeAction[key]}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="form-check form-check-theme ms-3">
                                ${inputEle}
                                <label class="form-check-label"></label>
                            </div>
                        </li>`
                }
            }
        }
        return actionEle
    }

    /***
     * get data list of default node
     */
    function setupInitNodeOrder(row, data) {
        let systemRowClass = "";
        let initialCheckBox = "";
        if (data.order === 1) {
            systemRowClass = "initial-row";
            initialCheckBox = "1"
            $(row).addClass(systemRowClass);
            $(row).attr("data-initial-check-box", initialCheckBox);
        } else if (data.order === 2) {
            systemRowClass = "approved-row";
            initialCheckBox = "2"
            $(row).addClass(systemRowClass);
            $(row).attr("data-initial-check-box", initialCheckBox);
        } else if (data.order === 3) {
            systemRowClass = "completed-row";
            initialCheckBox = "3"
            $(row).addClass(systemRowClass);
            $(row).attr("data-initial-check-box", initialCheckBox);
        }
    }

    function initTableNode(data) {
        // init dataTable
        let listData = data ? data : []
        let $tables = $('#datable-workflow-node-create');
        $tables.DataTable({
            data: listData,
            searching: false,
            ordering: false,
            paginate: false,
            info: false,
            drawCallback: function (row, data) {
                // render icon after table callback
                feather.replace();
            },
            rowCallback: function (row, data) {
                setupInitNodeOrder(row, data)
            },
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        let currentId = "";
                        if (row.order === 1) {
                            currentId = "check_sel_1";
                        }
                        return `<span class="form-check mb-0"><input type="checkbox" class="form-check-input check-select check-add-workflow-node" id="${currentId}"><label class="form-check-label" for="${currentId}"></label></span>`
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<span class="node-title" data-is-system="true" data-system-code="${row.code}">${row.title}</span>`
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        if (row.description) {
                            return `<span class="node-description">${row.description}</span>`
                        } else {
                            return `<span class="node-description"></span>`
                        }
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        let actionEle = renderAction();
                        if (row.order === 1) {
                            return `<div class="row">
                                        <div class="col-8">
                                            <div class="btn-group dropdown">
                                                <i class="fas fa-align-justify" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
                                                <div class="dropdown-menu w-250p">
                                                    <div class="h-250p">
                                                        <div data-simplebar class="nicescroll-bar">
                                                            <ul class="node-action-list p-0">
                                                                ${actionEle}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-4">
                                            <span class=""><i class="fas fa-check"></i></span>
                                        </div>
                                    </div>`;
                        } else {
                            return `<div class="row">
                                        <div class="col-8">
                                            <i class="fas fa-align-justify" style="color: #cccccc"></i>
                                        </div>
                                        <div class="col-4">
                                            <span class="check-done-audit"><i class="fas fa-check"></i></span>
                                        </div>
                                    </div>`
                        }
                    },
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        if (row.order === 1) {
                            return `<div class="row">
                                        <div class="col-8">
                                            <i class="fas fa-align-justify btn-initial-node-collaborator" data-bs-toggle="modal" data-bs-target="#auditModalCreateInitial"></i>
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
                                                                class="table nowrap w-100 mb-5 table-initial-node-collaborator"
                                                            >
                                                                <thead>
                                                                <tr>
                                                                    <th>Collaborator</th>
                                                                    <th>Position</th>
                                                                    <th>Role</th>
                                                                    <th>Editing Zone</th>
                                                                </tr>
                                                                </thead>
                                                                <tbody>
                                                                <td>Creator</td>
                                                                <td>Creator's position</td>
                                                                <td>Creator's role</td>
                                                                <td class="initial-node-collaborator-zone"></td>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                        <div class="modal-footer">
                                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${$.fn.transEle.attr('data-btn-close')}</button>
                                                            <button type="button" class="btn btn-primary btn-add-audit-create" data-bs-dismiss="modal">${$.fn.transEle.attr('data-btn-save')}</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-4">
                                            <span class="check-done-audit"><i class="fas fa-check"></i></span>
                                        </div>
                                    </div>`
                        } else {
                            return `<div class="row">
                                        <div class="col-8">
                                            <i class="fas fa-align-justify" style="color: #cccccc"></i>
                                        </div>
                                        <div class="col-4">
                                            <span class="check-done-audit"><i class="fas fa-check"></i></span>
                                        </div>
                                    </div>`;
                        }

                    }
                },
                {
                    targets: 5,
                    render: () => {
                        let bt2 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Edit" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit" style="color: #cccccc"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></span></span></a>`;
                        let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2" style="color: #cccccc"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></span></span></a>`;
                        let actionData = bt2 + bt3;
                        return `${actionData}`
                    }
                },
            ],
        });
    }

    function loadSystemNode() {
        let url = $('#url-factory').data('node');
        $.fn.callAjax(url, "GET").then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('node_system') && Array.isArray(data.node_system)) {
                        initTableNode(data.node_system);
                    }
                }
            },
        )
    }

    function loadInitPropertyInFrom() {
        let url = '/base/application-property-employee/api';
        let method = "GET"
        let ele = $('#data-init-property-in-form');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('property_employee_list') && Array.isArray(data.property_employee_list)) {
                        data.property_employee_list.map(function (item) {
                            ele.append(`<option value="${item.id}">${item.title}</option>`)
                        })
                    }
                }
            }
        )
    }

    function loadInitCompanyInWorkflow() {
        let url = '/company/list/api';
        let method = "GET"
        let ele = $('#data-init-company-in-workflow');
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

    function loadInitEmployeeInWorkflow() {
        let url = '/hr/employee/api';
        let method = "GET"
        let ele = $('#data-init-employee-in-workflow');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('employee_list') && Array.isArray(data.employee_list)) {
                        data.employee_list.map(function (item) {
                            let spanRole = ``;
                            if (item.role && Array.isArray(item.role)) {
                                for (let r = 0; r < item.role.length; r++) {
                                    spanRole += `<div><span class="badge badge-soft-primary">${item.role[r].title}</span></div>`
                                }
                            }
                            ele.append(`<option value="${item.id}" data-role="">${item.full_name}</option>
                                            <div hidden>${spanRole}</div>`)
                        })
                    }
                }
            }
        )
    }

    function loadAuditOutFormEmployee(tableId) {
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
                    return `<span class="form-check mb-0"><input type="checkbox" class="form-check-input check-select-employee-out-form"><label class="form-check-label"></label></span>`;
                }
            }]
        }

        function initDataTable(config) {
            /*DataTable Init*/
            let Id = "#" + tableId;
            let dtb = $(Id);
            if (dtb.length > 0) {
                let targetDt = dtb.DataTable(config);
                /*Checkbox Add*/
                $(document).on('click', '.del-button', function () {
                    targetDt.rows('.selected').remove().draw(false);
                    return false;
                });
                // $("div.blog-toolbar-left").html('<div class="d-xxl-flex d-none align-items-center"> <select class="form-select form-select-sm w-120p"><option selected>Bulk actions</option><option value="1">Edit</option><option value="2">Move to trash</option></select> <button class="btn btn-sm btn-light ms-2">Apply</button></div><div class="d-xxl-flex d-none align-items-center form-group mb-0"> <label class="flex-shrink-0 mb-0 me-2">Sort by:</label> <select class="form-select form-select-sm w-130p"><option selected>Date Created</option><option value="1">Date Edited</option><option value="2">Frequent Contacts</option><option value="3">Recently Added</option> </select></div>');
                dtb.parent().addClass('table-responsive');
            }
        }

        /***
         * call Ajax load employee list
         */
        function loadDataTable() {
            let dataRawEmployee = $('#wf-employee-out-form').val();
            if (dataRawEmployee) {
                config['data'] = JSON.parse(dataRawEmployee);
                initDataTable(config)
            }
        }
        loadDataTable();
    }

    function loadInitEmployeeOutForm() {
        let url = $('#url-factory').data('employees');
        let method = "GET";
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('employee_list')) {
                        $('#wf-employee-out-form').val(JSON.stringify(data.employee_list))
                    }
                }
            },
        )
    }

    $(document).ready(function () {
        let tableNode = $('#datable-workflow-node-create');

        loadSystemNode();
        loadInitPropertyInFrom();
        loadInitCompanyInWorkflow();
        loadInitEmployeeInWorkflow();
        loadInitEmployeeOutForm()

// Action on open modal node
        $('#add-new-node-workflow-create').on('click', '.open-modal-node', function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            $('#modal-node-name-create').val("");
            $('#modal-node-description-create').val("");
        });

// Action on add modal node
        $("#btn-add-new-node-create").on("click", function () {
            tableNodeAdd()
        });

        function tableNodeAdd() {
            let tableShowBodyOffModal = $('#datable-workflow-node-create tbody');
            let initialRow = tableShowBodyOffModal.find('.initial-row');
            let approvedRow = tableShowBodyOffModal.find('.approved-row');
            let completedRow = tableShowBodyOffModal.find('.completed-row');
            let initialCheckBox = initialRow[0].getAttribute('data-initial-check-box');
            let newCheckBox = String(Number(initialCheckBox) + 1);
            let approvedRowOrder = String(Number(initialCheckBox) + 2);
            let completedRowOrder = String(Number(initialCheckBox) + 3);

            let checkBox = `<span class="form-check mb-0"><input type="checkbox" class="form-check-input check-select"><label class="form-check-label"></label></span>`;
            let nodeName = $('#modal-node-name-create').val();
            let nodeDescription = $('#modal-node-description-create').val();
            let bt2 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover workflow-node-edit-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Edit" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></span></span></a>`;
            let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover workflow-node-del-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></span></span></a>`;
            let actionData = bt2 + bt3;
            let actionEle = renderAction(false);
            let modalAuditId = "auditModalCreate" + newCheckBox

            initialRow.after(`<tr class="initial-row" data-initial-check-box="${newCheckBox}"><td>${checkBox}</td><td><span class="node-title-col-show node-title">${nodeName}</span><input type="text" class="node-title-col-edit" hidden></td><td><span class="node-remark-col-show node-description">${nodeDescription}</span><input type="text" class="node-remark-col-edit" hidden></td>
                                    <td>
                                        <div class="row">
                                            <div class="col-8">
                                                <div class="btn-group dropdown">
                                                    <i class="fas fa-align-justify" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
                                                    <div class="dropdown-menu w-250p"><div class="h-250p"><div data-simplebar class="nicescroll-bar">
                                                        <ul class="node-action-list p-0">
                                                            ${actionEle}
                                                        </ul>
                                                    </div>
                                                    </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-4">
                                                <span class="check-done-action"><i class="fas fa-times"></i></span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="row">
                                            <div class="col-8">
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
                                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${$.fn.transEle.attr('data-btn-close')}</button>
                                                                <button type="button" class="btn btn-primary btn-add-audit-create" data-bs-dismiss="modal">${$.fn.transEle.attr('data-btn-save')}</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-4">
                                                <span class="check-done-audit"><i class="fas fa-times"></i></span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>${actionData}</td></tr>`);

            initialRow.removeClass('initial-row');
            approvedRow.attr('data-initial-check-box', approvedRowOrder);
            completedRow.attr('data-initial-check-box', completedRowOrder);
            return false;
        }

// Action on click btn edit row node
        tableNode.on('click', '.workflow-node-edit-button', function (e) {
            let titleShow = $(this)[0].closest('tr').querySelector('.node-title-col-show');
            let titleInput = $(this)[0].closest('tr').querySelector('.node-title-col-edit');
            let remarkShow = $(this)[0].closest('tr').querySelector('.node-remark-col-show');
            let remarkInput = $(this)[0].closest('tr').querySelector('.node-remark-col-edit');
            titleShow.setAttribute("hidden", true);
            titleInput.removeAttribute('hidden');
            titleInput.value = titleShow.innerHTML;
            remarkShow.setAttribute("hidden", true);
            remarkInput.removeAttribute('hidden');
            remarkInput.value = remarkShow.innerHTML;
        });

// Action on change node title
        tableNode.on('change', '.node-title-col-edit', function (e) {
            let titleShow = $(this)[0].closest('tr').querySelector('.node-title-col-show');
            let titleInputVal = $(this).val();
            titleShow.innerHTML = ``;
            titleShow.innerHTML = String(titleInputVal);
            $(this)[0].setAttribute("hidden", true);
            titleShow.removeAttribute('hidden');
        });

// Action on change node description
        tableNode.on('change', '.node-remark-col-edit', function (e) {
            let remarkShow = $(this)[0].closest('tr').querySelector('.node-remark-col-show');
            let remarkInputVal = $(this).val();
            remarkShow.innerHTML = ``;
            remarkShow.innerHTML = String(remarkInputVal);
            $(this)[0].setAttribute("hidden", true);
            remarkShow.removeAttribute('hidden');
        });

// Action on delete row node
        tableNode.on('click', '.workflow-node-del-button', function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            let currentRow = $(this).closest('tr');
            let prevRow = currentRow[0].previousElementSibling;
            let tableBody = $(this)[0].closest('tbody');
            currentRow.remove();
            prevRow.classList.add('initial-row');
            let order = 0;
            for (let idx = 0; idx < tableBody.rows.length; idx++) {
                order++;
                tableBody.rows[idx].setAttribute('data-initial-check-box', String(order))
            }
            return false;
        });

// Action on delete row audit employee in workflow
        tableNode.on('click', '.audit-in-workflow-del-button', function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            let currentRow = $(this).closest('tr')
            currentRow.remove();

            return false;
        });

// Action on change audit option
        tableNode.on('change', '.select-box-audit-option', function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            let eleTrOrder = $(this)[0].closest('tr').getAttribute('data-initial-check-box');
            let tableOutFormEmployeeId = "datable-audit-out-form-employee-" + eleTrOrder;
            let tableInWorkflowEmployeeId = "datable-audit-in-workflow-employee-" + eleTrOrder;
            let boxInWorkflowEmployeeId = "select-box-audit-in-workflow-employee-" + eleTrOrder;
            let boxInWorkflowCompanyId = "select-box-audit-in-workflow-company-" + eleTrOrder;
            let boxInFormPropertyId = "select-box-audit-in-form-property-" + eleTrOrder;
            let canvasId = "offcanvasRight" + eleTrOrder;
            let canvasInWorkflowId = "offcanvasRightInWorkflow" + eleTrOrder;

            let tableZone = document.getElementById('table_workflow_zone');
            let optionZone = ``;
            let orderNum = 0;

            optionZone += `<li class="d-flex align-items-center justify-content-between mb-3">
                                <div class="media d-flex align-items-center">
                                    <div class="media-body">
                                        <div>
                                            <div class="node-zone" data-node-zone="all">All</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-check form-check-theme ms-3">
                                    <input type="checkbox" class="form-check-input check-zone-node">
                                    <label class="form-check-label"></label>
                                </div>
                            </li>`

            for (let z = 0; z < tableZone.tBodies[0].rows.length; z++) {
                let row = tableZone.rows[z + 1];
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
                                            <input type="checkbox" class="form-check-input check-zone-node">
                                            <label class="form-check-label"></label>
                                        </div>
                                    </li>`
                }
            }
            // init zone data
            let defaultZone = `<div class="form-group">
                                <label class="form-label">Editing zone</label>
                                <div class="input-group mb-3">
                                    <span class="input-affix-wrapper">
                                    <input type="text" class="form-control" placeholder="Select zone" aria-label="Zone" aria-describedby="basic-addon1" style="background-color: white" disabled>
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
                                                ${$.fn.transEle.attr('data-add-employee')}
                                            </span>
                                        </span>
                                    </button>
                                    <div
                                        class="offcanvas offcanvas-end" tabindex="-1" id="${canvasInWorkflowId}"
                                        aria-labelledby="offcanvasTopLabel"
                                        style="width: 50%; margin-top: 4em;"
                                    >
                                        <div class="offcanvas-header">
                                            <h5 id="offcanvasRightLabel">${$.fn.transEle.attr('data-add-employee')}</h5>
                                        </div>
                                        <div class="offcanvas-body form-group">
                                            <div class="form-group">
                                                <label class="form-label">${$.fn.transEle.attr('data-select-company')}</label>
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
                                                    ${$.fn.transEle.attr('data-description')}
                                                </label>
                                                <textarea
                                                        class="form-control"
                                                        rows="4" cols="50"
                                                ></textarea>
                                                <span class="form-text text-muted">Description what to do</span>
                                            </div>
                                            <br><br>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="offcanvas">${$.fn.transEle.attr('data-btn-close')}</button>
                                                <button
                                                        type="button" 
                                                        class="btn btn-primary button-add-audit-in-workflow-employee" 
                                                        data-bs-dismiss="offcanvas"
                                                        id=""
                                                >${$.fn.transEle.attr('data-btn-save')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <table
                                        class="table nowrap w-100 mb-5 table-in-workflow-employee"
                                        id="${tableInWorkflowEmployeeId}"
                                    >
                                        <thead>
                                        <tr>
                                            <th data-orderable="false"></th>
                                            <th data-orderable="false">Collaborator</th>
                                            <th data-orderable="false">Position</th>
                                            <th data-orderable="false">Role</th>
                                            <th data-orderable="false">Editing Zone</th>
                                            <th data-orderable="false">Actions</th>
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
                                        class="form-select select-box-audit-in-form-property"
                                        id="${boxInFormPropertyId}"
                                >
                                    <option></option>
                                </select>
                            </div>
                            ${defaultZone}`)
                loadPropertyAuditInFrom(boxInFormPropertyId);
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
                                        <input type="text" class="form-control" placeholder="Select employees" aria-label="employees" aria-describedby="basic-addon1" style="background-color: white" disabled>
                                        
                                        <div class="row audit-out-form-employee-data-show"></div>
                                        
                                        <span class="input-suffix"><i class="fa fa-user" data-bs-toggle="offcanvas" data-bs-target="#${canvasId}"
                                            aria-controls="offcanvasExample"></i></span>
                                        <div
                                        class="offcanvas offcanvas-end" tabindex="-1" id="${canvasId}"
                                        aria-labelledby="offcanvasTopLabel"
                                        style="width: 50%; margin-top: 4em;"
                                >
                                    <div class="offcanvas-header">
                                        <h5 id="offcanvasRightLabel">${$.fn.transEle.attr('data-add-employee')}</h5>
                                    </div>
                                    <div class="offcanvas-body form-group">
                                        <table
                                                id="${tableOutFormEmployeeId}" class="table nowrap w-100 mb-5 table-out-form-employee"
                                                data-url="{% url 'EmployeeListAPI' %}"
                                                data-method="GET"
                                        >
                                            <thead>
                                            <tr>
                                                <th>${$.fn.transEle.attr('data-code')}</th>
                                                <th>${$.fn.transEle.attr('data-full-name')}</th>
                                                <th>${$.fn.transEle.attr('data-username')}</th>
                                                <th></th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            </tbody>
                                        </table>
                                        <br><br>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="offcanvas">${$.fn.transEle.attr('data-btn-close')}</button>
                                            <button
                                                    type="button" 
                                                    class="btn btn-primary button-add-audit-out-form-employee" 
                                                    data-bs-dismiss="offcanvas"
                                                    id=""
                                            >${$.fn.transEle.attr('data-btn-save')}
                                            </button>
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

                let jqueryId = "#" + tableInWorkflowEmployeeId;
                $(jqueryId).DataTable({
                    paging: false,
                    info: false,
                    searching: false,
                    autoWidth: false,
                });
            }
            return false;
        });

// Action on click check select box of table
        tableNode.on('click', '.check-select', function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            if ($(this).is(":checked")) {
                $(this).closest('tr').addClass('selected');
            } else {
                $(this).closest('tr').removeClass('selected');
                $('.check-select-all').prop('checked', false);
            }
        });

// Action on click check select all box of table
        tableNode.on('click', '.check-select-all', function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
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

// Action on click check select box of table employee out form
        tableNode.on('click', '.check-select-employee-out-form', function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            if ($(this).is(":checked")) {
                $(this).closest('tr').addClass('selected');
            } else {
                $(this).closest('tr').removeClass('selected');
                $('.check-select-all').prop('checked', false);
            }
        });

// Action on click check select all box of table employee in workflow
        tableNode.on('click', '.check-select-employee-in-workflow', function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            if ($(this).is(":checked")) {
                $(this).closest('tr').addClass('selected');
            } else {
                $(this).closest('tr').removeClass('selected');
                $('.check-select-all').prop('checked', false);
            }
        });

// load employee box filter by company
        tableNode.on('change', '.select-box-audit-in-workflow-company', function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            let companyId = $(this).val();
            let eleSelectEmp = $(this)[0].closest('.offcanvas-body').querySelector('.select-box-audit-in-workflow-employee');
            if (eleSelectEmp) {
                loadEmployeeCompanyAuditInWorkflow(eleSelectEmp.id, companyId);
            }
        });

// load data by specific collaborator
        function loadPropertyAuditInFrom(boxId) {
            let initData = document.getElementById('data-init-property-in-form').innerHTML;
            let jqueryId = "#" + boxId
            let ele = $(jqueryId);
            if (initData) {
               ele.append(initData)
            }
        }

        function loadCompanyAuditInWorkflow(boxId) {
            let initData = document.getElementById('data-init-company-in-workflow').innerHTML;
            let jqueryId = "#" + boxId
            let ele = $(jqueryId);
            if (initData) {
                ele.append(initData)
            }
        }

        function loadEmployeeAuditInWorkflow(boxId) {
            let initData = document.getElementById('data-init-employee-in-workflow').innerHTML;
            let jqueryId = "#" + boxId
            let ele = $(jqueryId);
            if (initData) {
                ele.append(initData)
            }
        }

        function loadEmployeeCompanyAuditInWorkflow(boxId, company_id) {
            let url = '/hr/employee/company/' + company_id;
            let method = "GET"
            let jqueryId = "#" + boxId
            let ele = $(jqueryId);
            $.fn.callAjax(url, method).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('employee_company_list') && Array.isArray(data.employee_company_list)) {
                            ele.text("");
                            ele.append(`<option>` + `</option>`);
                            data.employee_company_list.map(function (item) {
                                let spanRole = ``;
                                if (item.role && Array.isArray(item.role)) {
                                    for (let r = 0; r < item.role.length; r++) {
                                        spanRole += `<div><span class="badge badge-soft-primary">${item.role[r].title}</span></div>`
                                    }
                                }
                                ele.append(`<option value="${item.id}" data-role="">${item.full_name}</option>
                                    <div hidden>${spanRole}</div>`)
                            })
                        }
                    }
                }
            )
        }

// Action on add canvas employee out form
        tableNode.on('click', '.button-add-audit-out-form-employee', function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            let tableId = "#" + $(this)[0].closest('.modal-body').querySelector('.table-out-form-employee').id;
            let eleDivInputWrapper = $(this)[0].closest('.input-affix-wrapper');
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
            }
        });

// On click button add Employee Audit In Workflow
        tableNode.on('click', '.button-add-audit-in-workflow-employee', function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            let tableId = $(this)[0].closest('.modal-body').querySelector('.table-in-workflow-employee').id;
            let jqueryId = "#" + tableId;
            let table = $(jqueryId);
            let tableCheckEmpty = document.getElementById(tableId).tBodies[0].querySelector('.dataTables_empty');
            if (tableCheckEmpty) {
                document.getElementById(tableId).tBodies[0].innerHTML = ``;
            }
            let tableLen = document.getElementById(tableId).tBodies[0].rows.length;
            let tableRows = document.getElementById(tableId).tBodies[0].rows;
            let companySelectBox = document.getElementById($(this)[0].closest('.offcanvas-body').querySelector('.select-box-audit-in-workflow-company').id);
            let companySelected = companySelectBox.options[companySelectBox.selectedIndex];
            let employeeBoxId = $(this)[0].closest('.offcanvas-body').querySelector('.select-box-audit-in-workflow-employee').id;
            let employeeVal = $(this)[0].closest('.offcanvas-body').querySelector('.select-box-audit-in-workflow-employee').value;
            // Check employee exist
            for (let i = 0; i < tableLen; i++) {
                let empExist = tableRows[i].querySelector('.data-in-workflow-employee');
                if (empExist) {
                    let empIdExist = empExist.value;
                    if (empIdExist === employeeVal) {
                        $.fn.notifyB({description: 'Employee already exists. Please choose other employee'}, 'failure');
                        return false
                    }
                }
            }
            // end check
            let empSelectBox = document.getElementById(employeeBoxId);
            let empSelected = empSelectBox.options[empSelectBox.selectedIndex];
            let empTitle = empSelected.text;
            let empRole = ``;
            if (empSelected.innerHTML) {
                empRole = empSelected.nextElementSibling.innerHTML;
            }
            let zone = empSelectBox.closest('div').nextElementSibling.querySelector('.zone-data-show');
            let zoneInput = zone.previousElementSibling;
            let zoneDataList = zone.nextElementSibling.querySelector('.node-zone-list');
            let zoneShowLen = 0;
            let trSTT = 0;
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
                        dataZoneShow += `<div class="col-12" style="margin-left: -18px">
                                            <span class="badge badge-soft-primary mt-1 ml-1">${spanData}</span>
                                        </div>`
                    }
                }
            }

            let checkBox = `<span class="form-check mb-0"><input type="checkbox" class="form-check-input check-select-employee-in-workflow"><label class="form-check-label"></label></span>`;
            let delAction = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover audit-in-workflow-del-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></span></span></a>`;

            if (empTitle) {
                table.append(`<tr><td>${checkBox}</td><td>${empTitle}<input class="data-in-workflow-employee" type="text" value="${employeeVal}" hidden></td><td></td><td>${empRole}</td><td class="data-in-workflow-zone">${dataZoneShow}</td><td>${delAction}</td></tr>`)
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

// On check zone of node
        tableNode.on('click', '.check-zone-node', function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            let eleUL = $(this)[0].closest('ul');
            let dataChecked = 0;

            // check option all
            let eleDivDataCheck = $(this)[0].closest('li').querySelector('.node-zone');
            if (eleDivDataCheck.getAttribute('data-node-zone') === "all") {
                if ($(this)[0].checked === true) {
                    for (let li = 0; li < eleUL.children.length; li++) {
                        let eleInput = eleUL.children[li + 1].querySelector('.check-zone-node');
                        if (eleInput) {
                            eleInput.checked = true;
                            dataChecked++
                        }
                        if ((li + 1) === (eleUL.children.length - 1)) {
                            break
                        }
                    }
                } else {
                    for (let li = 0; li < eleUL.children.length; li++) {
                        let eleInput = eleUL.children[li + 1].querySelector('.check-zone-node');
                        if (eleInput) {
                            eleInput.checked = false;
                        }
                        if ((li + 1) === (eleUL.children.length - 1)) {
                            break
                        }
                    }
                }
            } else {
                for (let li = 0; li < eleUL.children.length; li++) {
                    let eleInput = eleUL.children[li].querySelector('.check-zone-node');
                    if (li === 0) {
                        eleInput.checked = false;
                        continue;
                    }
                    if (eleInput.checked === true) {
                        dataChecked++
                    }
                }
            }
            // append data show
            let checkInitial = $(this)[0].getAttribute('data-node-initial');
            if (checkInitial === "true") {
                let eleDivRow = eleUL.closest('.row');
                let eleSpan = eleDivRow.querySelector('.zone-node-initial-show');
                let dataShow = ``;
                let span = ``;
                if (eleUL.children.length > 0) {
                    for (let li = 0; li < eleUL.children.length; li++) {
                        let eleLi = eleUL.children[li];
                        let input = eleLi.querySelector('.check-zone-node');
                        let eleDivData = eleLi.querySelector('.node-zone');
                        if (input.checked === true) {
                            let childID = eleDivData.getAttribute('data-node-zone');
                            if (childID === "all") {
                                continue;
                            }
                            let childTitle = eleDivData.innerHTML;
                            span = `<span class="badge badge-soft-primary mt-1 ml-1">${childTitle}<input type="text" value="${childID}" hidden></span>`
                            dataShow += `<div class="col-12" style="margin-left: -30px">${span}</div>`
                        }
                    }
                }
                eleSpan.innerHTML = "";
                eleSpan.innerHTML = dataShow;
            } else {
                let dataShow = ``;
                let spanGroup = ``;
                let zoneEle = $(this)[0].closest('span');
                let zoneInput = zoneEle.children[0];
                let zoneShow = zoneEle.children[1];
                let trSTT = 0;
                for (let li = 0; li < eleUL.children.length; li++) {
                    let eleLi = eleUL.children[li];
                    let eleDivData = eleLi.querySelector('.node-zone');
                    let childID = eleDivData.getAttribute('data-node-zone');
                    if (childID === "all") {
                        continue;
                    }
                    let eleInput = eleUL.children[li].querySelector('.check-zone-node')
                    if (eleInput) {
                        if (eleInput.checked === true) {
                            let childTitle = eleDivData.innerHTML;
                            trSTT++;
                            if (trSTT !== 0 && trSTT % 5 === 0) {
                                spanGroup += `<span class="badge badge-soft-primary mt-1 ml-1">${childTitle}<input type="text" class="zone-in-workflow-id" value="${childID}" hidden></span>`
                                dataShow += `<div class="col-12" style="margin-left: -30px">${spanGroup}</div>`
                                spanGroup = ``
                            } else {
                                if (trSTT === dataChecked) {
                                    spanGroup += `<span class="badge badge-soft-primary mt-1 ml-1">${childTitle}<input type="text" class="zone-in-workflow-id" value="${childID}" hidden></span>`
                                    dataShow += `<div class="col-12" style="margin-left: -30px">${spanGroup}</div>`
                                } else {
                                    spanGroup += `<span class="badge badge-soft-primary mt-1 ml-1">${childTitle}<input type="text" class="zone-in-workflow-id" value="${childID}" hidden></span>`
                                }
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
            }
        });

// On check action node & change status
        tableNode.on('click', '.check-action-node', function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();

            let eleTd = $(this)[0].closest('td');
            let eleSpan = eleTd.querySelector('.check-done-action');
            let eleLi = $(this)[0].closest('li');
            let eleUL = $(this)[0].closest('ul');
            let dataAction = eleLi.querySelector('.node-action').getAttribute('data-action');

            // checked
            if ($(this)[0].checked === true) {
                // change node's actions status
                eleSpan.innerHTML = ``;
                eleSpan.innerHTML = `<i class="fas fa-check"></i>`;

                // check group actions
                if (dataAction === "1") {
                    for (let li = 0; li < eleUL.children.length; li++) {
                        let dataAction = eleUL.children[li].querySelector('.node-action').getAttribute('data-action');
                        let eleInput = eleUL.children[li].querySelector('.check-action-node');
                        if (dataAction === "2" || dataAction === "3") {
                            eleInput.checked = true
                        }
                        if (dataAction === "4" || dataAction === "5") {
                            eleInput.setAttribute("disabled", true)
                        }
                    }
                }
                if (dataAction === "2" || dataAction === "3") {
                    for (let li = 0; li < eleUL.children.length; li++) {
                        let dataAction = eleUL.children[li].querySelector('.node-action').getAttribute('data-action');
                        let eleInput = eleUL.children[li].querySelector('.check-action-node');
                        if (dataAction === "1") {
                            eleInput.checked = true
                        }
                        if (dataAction === "4" || dataAction === "5") {
                            eleInput.setAttribute("disabled", true)
                        }
                    }
                }
                if (dataAction === "4" || dataAction === "5") {
                    if (dataAction === "4") {
                        for (let li = 0; li < eleUL.children.length; li++) {
                            let dataAction = eleUL.children[li].querySelector('.node-action').getAttribute('data-action');
                            let eleInput = eleUL.children[li].querySelector('.check-action-node');
                            if (dataAction === "1" || dataAction === "2" || dataAction === "3" || dataAction === "5") {
                                eleInput.setAttribute("disabled", true)
                            }
                        }
                    } else {
                        for (let li = 0; li < eleUL.children.length; li++) {
                            let dataAction = eleUL.children[li].querySelector('.node-action').getAttribute('data-action');
                            let eleInput = eleUL.children[li].querySelector('.check-action-node');
                            if (dataAction === "1" || dataAction === "2" || dataAction === "3" || dataAction === "4") {
                                eleInput.setAttribute("disabled", true)
                            }
                        }
                    }
                }
            }
            // unchecked
            else {
                // check group actions
                if (dataAction === "1") {
                    for (let li = 0; li < eleUL.children.length; li++) {
                        let dataAction = eleUL.children[li].querySelector('.node-action').getAttribute('data-action');
                        let eleInput = eleUL.children[li].querySelector('.check-action-node');
                        if (dataAction === "2" || dataAction === "3") {
                            eleInput.checked = false
                        }
                        if (dataAction === "4" || dataAction === "5") {
                            eleInput.removeAttribute('disabled')
                        }
                    }
                }

                if (dataAction === "2" || dataAction === "3") {
                    if (dataAction === "2") {
                        for (let li = 0; li < eleUL.children.length; li++) {
                            let dataAction = eleUL.children[li].querySelector('.node-action').getAttribute('data-action');
                            let eleInput = eleUL.children[li].querySelector('.check-action-node');
                            if (dataAction === "1" || dataAction === "3") {
                                eleInput.checked = true
                            }
                        }
                    } else {
                        for (let li = 0; li < eleUL.children.length; li++) {
                            let dataAction = eleUL.children[li].querySelector('.node-action').getAttribute('data-action');
                            let eleInput = eleUL.children[li].querySelector('.check-action-node');
                            if (dataAction === "1" || dataAction === "2") {
                                eleInput.checked = true
                            }
                        }
                    }
                }

                if (dataAction === "4" || dataAction === "5") {
                    for (let li = 0; li < eleUL.children.length; li++) {
                        let dataAction = eleUL.children[li].querySelector('.node-action').getAttribute('data-action');
                        let eleInput = eleUL.children[li].querySelector('.check-action-node');
                        if (dataAction === "1" || dataAction === "2" || dataAction === "3" || dataAction === "4" || dataAction === "5") {
                            eleInput.removeAttribute('disabled')
                        }
                    }
                }

                // change node's status
                let allUnCheck = 0;
                for (let li = 0; li < eleUL.children.length; li++) {
                    let eleInput = eleUL.children[li].querySelector('.check-action-node');
                    if (eleInput.checked === false) {
                        allUnCheck++;
                    }
                }
                if (allUnCheck === eleUL.children.length) {
                    eleSpan.innerHTML = ``;
                    eleSpan.innerHTML = `<i class="fas fa-times"></i>`;
                }
            }
        });

// On check collaborator node & change status
        tableNode.on('click', '.btn-add-audit-create', function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            let eleSpan = $(this)[0].closest('td').querySelector('.check-done-audit');

            let eleModal = $(this)[0].closest('td');
            let employeeInForm = eleModal.querySelector('.select-box-audit-in-form-property');
            let employeeOutForm = eleModal.querySelector('.audit-out-form-employee-data-show');
            let employeeInWorkflow = eleModal.querySelector('.table-in-workflow-employee');

            if (employeeInForm) {
                if (employeeInForm) {
                    if (employeeInForm.value) {
                        eleSpan.innerHTML = ``;
                        eleSpan.innerHTML = `<i class="fas fa-check"></i>`;
                    } else {
                        eleSpan.innerHTML = ``;
                        eleSpan.innerHTML = `<i class="fas fa-times"></i>`;
                    }
                }
            } else if (employeeOutForm) {
                if (employeeOutForm.querySelector('.col-8')) {
                    if (employeeOutForm.querySelector('.col-8').children.length > 0) {
                        eleSpan.innerHTML = ``;
                        eleSpan.innerHTML = `<i class="fas fa-check"></i>`;
                    }
                } else {
                    eleSpan.innerHTML = ``;
                    eleSpan.innerHTML = `<i class="fas fa-times"></i>`;
                }
            } else if (employeeInWorkflow) {
                let body = employeeInWorkflow.tBodies[0];
                if (!body.querySelector('.dataTables_empty') && body.rows.length > 0) {
                    eleSpan.innerHTML = ``;
                    eleSpan.innerHTML = `<i class="fas fa-check"></i>`;
                } else {
                    eleSpan.innerHTML = ``;
                    eleSpan.innerHTML = `<i class="fas fa-times"></i>`;
                }
            }
        });
    });

});



