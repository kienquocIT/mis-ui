$(function () {
    /***
     * get data received form ajax and parse value to HTML
     * @param res response data of workflow detail
     * @param {{is_define_zone:string}} data
     */
    function prepareDataAndRenderHTML(res){
        if(res.title) $('[name="title"]').val(res.title);
        if(res.application){
            const elmApp = $('[name="application"]');
            elmApp.attr('data-onload', JSON.stringify(res.application));
            initSelectbox(elmApp)
        }
        if (res.is_define_zone) $('[name="define_zone"]').val(res.is_define_zone);
        if (res.zone) initTableZone(res.zone);
        if (res.zone) $('#zone-list').val(JSON.stringify(res.zone));
        if (res.node) $('#node-list').val(JSON.stringify(res.node)); // khúc này d?i P làm function node r?i ráp vào
        if (res.association) $('#associate-connect').val(JSON.stringify(res.association))
    }

    /***
     * show save button and turn on edit mode of Form
     */
    function clickEditForm(){
        $('form').off().on('dblclick', function(){
            const $form = $(this).closest('form');
            if (!$form.attr('readonly')) return false
            $('#btn-detail_workflow').removeClass('hidden');
            $form.removeAttr('readonly');
            $form.find('input[readonly]').removeAttr('readonly')
            $form.find('input[type="checkbox"][disabled]').prop('disabled', false)
            $form.find('select[disabled]').prop('disabled', false)
            $('.actions-btn a').removeClass('disabled')
        });
    }

    /***
     * call ajax update form when user click button
     */
    function UpdateFormSubmit(){
        $('#btn-detail_workflow:not(.disabled)').on('click', function(){
            // show loading
            $(this).addClass('disabled')
            $(this).find('.feather-icon').addClass('hidden')
            $(this).find('.loading-icon').removeClass('hidden')

            // prepare data
            let frm = new SetupFormSubmit($(this));
            let csr = $("input[name=csrfmiddlewaretoken]").val();
            if (frm.dataForm) {
            for (let key in frm.dataForm) {
                if (frm.dataForm[key] === '') {
                    delete frm.dataForm[key]
                }
            }

            $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyPopup({description: data.message}, 'success')
                        $.fn.redirectUrl(frm.dataUrlRedirect, 3000);
                    }
                },
                (errs) => {
                    // if (errs.data.errors.hasOwnProperty('detail')) {
                    //     $.fn.notifyPopup({description: String(errs.data.errors['detail'])}, 'failure')
                    // }
                }
            )
        }
        })
    }

    /***
     * functions support for main function loadTableNode
     */
    function loadInitPropertyInFromDetail() {
        let url = '/base/application-property-employee/api';
        let method = "GET"
        let ele = $('#data-init-property-in-form-detail');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('property_employee_list') && Array.isArray(data.property_employee_list)) {
                        data.property_employee_list.map(function (item) {
                            ele.append(`<option value="${item.code}">${item.title}</option>`)
                        })
                    }
                }
            }
        )
    }

    function loadAction(action_list, is_system_node = true) {
        let actionEle = ``;
        let nodeActionRaw = $('#wf_action').text();
        if (nodeActionRaw) {
            let nodeAction = JSON.parse(nodeActionRaw);
            let inputEle = ``;
            if (is_system_node === true) {
                for (let key in nodeAction) {
                    if (String(key) === "0") {
                        inputEle = `<input type="checkbox" class="check-action-node" id="customCheck6" checked disabled>`;
                    } else {
                        inputEle = `<input type="checkbox" class="check-action-node" id="customCheck6" disabled>`;
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
                                <label class="form-check-label" for="customCheck6"></label>
                            </div>
                        </li>`
                }
            } else {
                for (let key in nodeAction) {
                    if (String(key) === "0") {
                        inputEle = `<input type="checkbox" class="form-check-input check-action-node" id="customCheck6" disabled>`
                    } else {
                        if (action_list.includes(Number(key))) {
                            inputEle = `<input type="checkbox" class="form-check-input check-action-node" id="customCheck6" checked disabled>`;
                        } else {
                            inputEle = `<input type="checkbox" class="form-check-input check-action-node" id="customCheck6" disabled>`;
                        }
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
                                <label class="form-check-label" for="customCheck6"></label>
                            </div>
                        </li>`
                }
            }
        }
        return actionEle
    }

    function loadZoneInCollab(zone_collab, zone_list) {
        let dataShow = ``;
        let spanGroup = ``;
        let zoneCollabOrder = [];
        for (let i = 0; i < zone_collab.length; i++) {
            zoneCollabOrder.push(zone_collab[i].order)
        }
        let optionZone = ``;
        optionZone += `<li class="d-flex align-items-center justify-content-between mb-3">
                            <div class="media d-flex align-items-center">
                                <div class="media-body">
                                    <div>
                                        <div class="node-zone" data-node-zone="all">All</div>
                                    </div>
                                </div>
                            </div>
                            <div class="form-check form-check-theme ms-3">
                                <input type="checkbox" class="form-check-input check-zone-node" id="customCheck6" disabled>
                                <label class="form-check-label" for="customCheck6"></label>
                            </div>
                        </li>`
        let trSTT = 0;
        let dataChecked = zoneCollabOrder.length;
        for (let z = 0; z < zone_list.length; z++) {
            let order = zone_list[z].order;
            let title = zone_list[z].title
            let input = `<input type="checkbox" class="form-check-input check-zone-node" id="customCheck6" disabled>`;
            if (zoneCollabOrder.includes(order)) {
                input = `<input type="checkbox" class="form-check-input check-zone-node" id="customCheck6" checked disabled>`;
                trSTT++;
                if (trSTT !== 0 && trSTT % 5 === 0) {
                    spanGroup += `<span class="badge badge-soft-primary mt-1 ml-1">${title}<input type="text" value="${order}" hidden></span>`
                    dataShow += `<div class="col-12" style="margin-left: -30px">${spanGroup}</div>`
                    spanGroup = ``
                } else {
                    if (trSTT === dataChecked) {
                        spanGroup += `<span class="badge badge-soft-primary mt-1 ml-1">${title}<input type="text" value="${order}" hidden></span>`
                        dataShow += `<div class="col-12" style="margin-left: -30px">${spanGroup}</div>`
                    } else {
                        spanGroup += `<span class="badge badge-soft-primary mt-1 ml-1">${title}<input type="text" value="${order}" hidden></span>`
                    }
                }
            }
            optionZone += `<li class="d-flex align-items-center justify-content-between mb-3">
                                <div class="media d-flex align-items-center">
                                    <div class="media-body">
                                        <div>
                                            <div class="node-zone" data-node-zone="${order}">${title}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-check form-check-theme ms-3">
                                    ${input}
                                    <label class="form-check-label" for="customCheck6"></label>
                                </div>
                            </li>`
        }
        return {optionZone, dataShow}
    }

    function loadPropertyCollabInFrom(current_property) {
        let optionProperty = `<option></option>`;
        let initDataOptions = document.getElementById('data-init-property-in-form-detail').options;
        for (let i = 0; i < initDataOptions.length; i++) {
            if (initDataOptions[i].value && initDataOptions[i].innerHTML) {
                if (initDataOptions[i].value === current_property) {
                    optionProperty += `<option value="${initDataOptions[i].value}" selected>${initDataOptions[i].innerHTML}</option>`
                } else {
                    optionProperty += `<option value="${initDataOptions[i].value}">${initDataOptions[i].innerHTML}</option>`
                }
            }

        }
        return optionProperty
    }

    function loadEmployeeCollabOutForm(employee_collab) {
        let dataShow = ``;
        let spanGroup = ``;
        let trSTT = 0;
        let employeeIDList = [];
        for (let idx = 0; idx < employee_collab.length; idx++) {
            let dataCheckedLen = employee_collab.length;
            let childID = employee_collab[idx].id;
            let childTitle = employee_collab[idx].full_name;
            trSTT++;
            employeeIDList.push(childID);

            if (trSTT !== 0 && trSTT % 5 === 0) {
                spanGroup += `<span class="badge badge-soft-primary mt-1 ml-1">${childTitle}<input type="text" value="${childID}" hidden></span>`
                dataShow += `<div class="col-8">${spanGroup}</div>`
                spanGroup = ``
            } else {
                if (trSTT === dataCheckedLen) {
                    spanGroup += `<span class="badge badge-soft-primary mt-1 ml-1">${childTitle}<input type="text" value="${childID}" hidden></span>`
                    dataShow += `<div class="col-8">${spanGroup}</div>`
                } else {
                    spanGroup += `<span class="badge badge-soft-primary mt-1 ml-1">${childTitle}<input type="text" value="${childID}" hidden></span>`
                }
            }
        }
        return {employeeIDList, dataShow}
    }

    function setupNodeOrder(row, data, dataLen) {
        let systemRowClass = "";
        let initialCheckBox = "";
        if (data.code_node_system === 'initial') {
            if (dataLen === 3) {
                systemRowClass = "initial-row";
            }
            initialCheckBox = String(data.order)
            $(row).addClass(systemRowClass);
            $(row).attr("data-initial-check-box", initialCheckBox);
        } else if (data.code_node_system === 'approved') {
            systemRowClass = "approved-row";
            initialCheckBox = String(data.order)
            $(row).addClass(systemRowClass);
            $(row).attr("data-initial-check-box", initialCheckBox);
        } else if (data.code_node_system === 'completed') {
            systemRowClass = "completed-row";
            initialCheckBox = String(data.order)
            $(row).addClass(systemRowClass);
            $(row).attr("data-initial-check-box", initialCheckBox);
        } else {
            if (dataLen !== 3) {
                if (data.order === (dataLen - 2)) {
                    systemRowClass = "initial-row";
                }
                initialCheckBox = String(data.order)
                $(row).addClass(systemRowClass);
                $(row).attr("data-initial-check-box", initialCheckBox);
            }
        }
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
                    next: '<i class="ri-arrow-right-s-line"></i>', // or '?'
                    previous: '<i class="ri-arrow-left-s-line"></i>' // or '?'
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
                    return `<span class="form-check mb-0"><input type="checkbox" class="form-check-input check-select-employee-out-form" id="${currentId}"><label class="form-check-label" for="${currentId}"></label></span>`;
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
                $("div.blog-toolbar-left").html('<div class="d-xxl-flex d-none align-items-center"> <select class="form-select form-select-sm w-120p"><option selected>Bulk actions</option><option value="1">Edit</option><option value="2">Move to trash</option></select> <button class="btn btn-sm btn-light ms-2">Apply</button></div><div class="d-xxl-flex d-none align-items-center form-group mb-0"> <label class="flex-shrink-0 mb-0 me-2">Sort by:</label> <select class="form-select form-select-sm w-130p"><option selected>Date Created</option><option value="1">Date Edited</option><option value="2">Frequent Contacts</option><option value="3">Recently Added</option> </select></div>');
                dtb.parent().addClass('table-responsive');
            }
        }
        /***
         * call Ajax load employee list
         */
        function loadDataTable() {
            let url = $('#url-factory').data('employees');
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

    /***
     * get data list of nodes from detail
     */
    function loadTableNode(data, zone_list) {
        // init dataTable
        let listData = data ? data : [];
        let dataLen = listData.length;
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
                setupNodeOrder(row, data, dataLen);
            },
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        let currentId = "";
                        if (row.code_node_system === 'initial') {
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
                        let actionEle = ``;
                        if (row.code_node_system === 'initial') {
                            actionEle = loadAction(row.actions, true);
                            return `<div class="row">
                                        <div class="col-8">
                                            <div class="btn-group dropdown">
                                                <i class="fas fa-align-justify" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="color: #cccccc"></i>
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
                                            <span class=""><i class="fas fa-check" style="color: #00D67F; font-size: 20px"></i></span>
                                        </div>
                                    </div>`;
                        } else if (row.code_node_system === 'approved' || row.code_node_system === 'completed') {
                            return `<div class="row">
                                        <div class="col-8">
                                            <i class="fas fa-align-justify" style="color: #cccccc"></i>
                                        </div>
                                        <div class="col-4">
                                            <span class="check-done-audit"><i class="fas fa-check" style="color: #00D67F; font-size: 20px"></i></span>
                                        </div>
                                    </div>`
                        } else {
                            if (row.actions) {
                                actionEle = loadAction(row.actions, false);
                            }
                            return `<div class="row">
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
                                            <span class="check-done-action"><i class="fas fa-check" style="color: #00D67F; font-size: 20px"></i></span>
                                        </div>
                                    </div>`
                        }
                    },
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        if (row.code_node_system === 'initial') {
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
                                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                            <button type="button" class="btn btn-primary btn-add-audit-create" data-bs-dismiss="modal">Save changes</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-4">
                                            <span class="check-done-audit"><i class="fas fa-check" style="color: #00D67F; font-size: 20px"></i></span>
                                        </div>
                                    </div>`
                        } else if (row.code_node_system === 'approved' || row.code_node_system === 'completed') {
                            return `<div class="row">
                                        <div class="col-8">
                                            <i class="fas fa-align-justify" style="color: #cccccc"></i>
                                        </div>
                                        <div class="col-4">
                                            <span class="check-done-audit"><i class="fas fa-check" style="color: #00D67F; font-size: 20px"></i></span>
                                        </div>
                                    </div>`;
                        } else {
                            let newCheckBox = String(Number(row.order) + 1);
                            let modalAuditId = "auditModalCreate" + newCheckBox;
                            let collabBody = ``;
                            let optionZone = ``;
                            let dataZoneShow = ``;
                            if (row.option_collaborator === 0) {
                                let zoneData = loadZoneInCollab(row.collab_in_form.zone, zone_list);
                                optionZone = zoneData.optionZone;
                                dataZoneShow = zoneData.dataShow;
                            } else if (row.option_collaborator === 1) {
                                let zoneData = loadZoneInCollab(row.collab_out_form.zone, zone_list);
                                optionZone = zoneData.optionZone;
                                dataZoneShow = zoneData.dataShow;
                            } else if (row.option_collaborator === 2) {
                                optionZone = ``;
                            }
                            let defaultZone = `<div class="form-group">
                                                    <label class="form-label">Editing zone</label>
                                                    <div class="input-group mb-3">
                                                        <span class="input-affix-wrapper">
                                                        <input type="text" class="form-control" placeholder="Select zone" aria-label="Zone" aria-describedby="basic-addon1" style="background-color: white" disabled hidden>
                                                        <div class="zone-data-show col-11" style="margin-right: 38px">${dataZoneShow}</div>
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
                            if (row.option_collaborator === 0) {
                                let boxInFormPropertyId = "select-box-audit-in-form-property-" + String(row.order);
                                let optionProperty = loadPropertyCollabInFrom(row.collab_in_form.employee_field);
                                collabBody = `<div class="form-group">
                                                <label class="form-label">List source</label>
                                                <select
                                                        class="form-select select-box-audit-option"
                                                        disabled
                                                >
                                                    <option></option>
                                                    <option value="0" selected>In form</option>
                                                    <option value="1">Out form</option>
                                                    <option value="2">In workflow</option>
                                                </select>
                                            </div>
                                            <div class="form-group">
                                                <label class="form-label">Select field in form</label>
                                                <select
                                                        class="form-select select-box-audit-in-form-property"
                                                        id="${boxInFormPropertyId}"
                                                        disabled
                                                >
                                                    ${optionProperty}
                                                </select>
                                            </div>
                                            ${defaultZone}`
                            } else if (row.option_collaborator === 1) {
                                let tableOutFormEmployeeId = "datable-audit-out-form-employee-" + String(row.order);
                                let canvasId = "offcanvasRight" + String(row.order);
                                let empData = loadEmployeeCollabOutForm(row.collab_out_form.employee_list)
                                let employeeIDList = empData.employeeIDList;
                                let dataShow = empData.dataShow;
                                collabBody = `<div class="form-group">
                                                <label class="form-label">List source</label>
                                                <select
                                                        class="form-select select-box-audit-option"
                                                        disabled
                                                >
                                                    <option></option>
                                                    <option value="0">In form</option>
                                                    <option value="1" selected>Out form</option>
                                                    <option value="2">In workflow</option>
                                                </select>
                                            </div>
                                            <div class="form-group">
                                                <label class="form-label">Employee list</label>
                                                <div class="input-group mb-3">
                                                    <span class="input-affix-wrapper">
                                                    <input type="text" class="form-control" placeholder="Select employees" aria-label="employees" aria-describedby="basic-addon1" style="background-color: white" value="${employeeIDList}" hidden disabled>
                                                    <div class="row audit-out-form-employee-data-show">${dataShow}</div>
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
                                                        <div class="modal-footer">
                                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="offcanvas">Close</button>
                                                            <button
                                                                    type="button" 
                                                                    class="btn btn-primary button-add-audit-out-form-employee" 
                                                                    data-bs-dismiss="offcanvas"
                                                                    id=""
                                                            >Save changes
                                                            </button>
                                                        </div>
                                                    </div>
                                                    </div>
                                                    </span>
                                                </div>
                                            </div>
                                        ${defaultZone}`
                                loadAuditOutFormEmployee(tableOutFormEmployeeId);
                            } else if (row.option_collaborator === 2) {

                            }
                            return `<div class="row">
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
                                                            ${collabBody}
                                                        </div>
                                                        <div class="modal-footer">
                                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                            <button type="button" class="btn btn-primary btn-add-audit-create" data-bs-dismiss="modal">Save changes</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-4">
                                            <span class="check-done-audit"><i class="fas fa-check" style="color: #00D67F; font-size: 20px"></i></span>
                                        </div>
                                    </div>`
                        }
                    }
                },
                {
                    targets: 5,
                    render: () => {
                        let bt2 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover" `
                            +`data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Edit" `
                            +`href="#"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="edit">`
                            +`</i></span></span></a>`;
                        let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover" `
                            +`data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" `
                            +`href="#"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`;
                        let actionData = bt2 + bt3;
                        return `${actionData}`
                    }
                },
            ],
        });
    }

    $(document).ready(function() {
        let $form = $('#form-detail_workflow')

        loadInitPropertyInFromDetail();

        // call ajax get info wf detail
        $.fn.callAjax($form.data('url'), 'GET')
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        prepareDataAndRenderHTML(data);
                        loadTableNode(data.node, data.zone);
                        clickEditForm();
                        UpdateFormSubmit();
                    }
                }
            )

        // form submit
        $('#btn-detail_workflow').on('click', function (e) {
            e.preventDefault()
            let $form = document.getElementById('form-detail_workflow')
            let _form = new SetupFormSubmit($('#form-detail_workflow'))
            let dataZone = $('#table_workflow_zone').DataTable().data().toArray()
            if (dataZone.length && typeof dataZone[0] === 'object')
                // convert property list from object to id array list
                for (let item of dataZone){
                    let property_temp = []
                    for (let val of item.property_list){
                        property_temp.push(val.id)
                    }
                    item.property_list = property_temp
                }
            _form.dataForm['zone'] = dataZone
            let nodeTableData = setupDataNode(true);
            // add condition object for node list
            // if (COMMIT_NODE_LIST)
            let flowNode = FlowJsP.getCommitNode
            for (let item of nodeTableData) {
                if (flowNode.hasOwnProperty(item.order)){
                    const node = document.getElementById(`control-${item.order}`);
                    const offset = jsPlumb.getOffset(node);
                    //add coord of node
                    item.coordinates = {
                        top: offset.top,
                        left: offset.left,
                    }
                    item.condition = flowNode[item.order]
                }
                else{
                    item.condition = []
                    item.coordinates = {}
                }

            }
            _form.dataForm['node'] = nodeTableData

            // convert associate to json
            let associate_temp = _form.dataForm['associate'].replaceAll('\\', '');
            if (associate_temp) {
                let associate_data_submit = [];
               let associate_data_json =  JSON.parse(associate_temp);
               for (let item of associate_data_json) {
                   if (typeof item.node_in === "object"){
                       // case from detail page update workflow if node_in is not order number
                       item.node_in = item.node_in.order
                       item.node_out = item.node_out.order
                   }
                   associate_data_submit.push(item);
               }
               _form.dataForm['association'] = associate_data_submit;
            }

            let submitFields = [
                'title',
                'application',
                'node',
                'zone',
                'is_multi_company',
                'is_define_zone',
                'actions_rename',
                'association',
            ]
            if (_form.dataForm) {
                for (let key in _form.dataForm) {
                    if (!submitFields.includes(key)) delete _form.dataForm[key]
                }
            }
            let temp = _form.dataForm['actions_rename']
            if (temp) _form.dataForm['actions_rename'] = JSON.parse(temp)
            else _form.dataForm['actions_rename'] = []

            let csr = $("[name=csrfmiddlewaretoken]").val()

            $.fn.callAjax(_form.dataUrl, _form.dataMethod, _form.dataForm, csr)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyPopup({description: data.message}, 'success')
                            $.fn.redirectUrl($($form).attr('data-url-redirect'), 3000);
                        }
                    },
                    (errs) => {
                        console.log(errs)
                        $.fn.notifyPopup({description: "Workflow create fail"}, 'failure')
                    }
                )
        });

    }); // end document ready
}, jQuery);