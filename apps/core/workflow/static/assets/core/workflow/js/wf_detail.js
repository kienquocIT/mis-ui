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
        if (res.zone){
            initTableZone(res.zone);
            $('#zone-list').val(JSON.stringify(res.zone));
        }
        if (res.node) $('#node-list').val(JSON.stringify(res.node));
        if (res.association) $('#node-associate').val(JSON.stringify(res.association))
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
            // $form.find('select[disabled]').prop('disabled', false)
            $form.find('select[disabled]:not(.is-not-enabled)').prop('disabled', false)
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

    function loadTableInWorkflow(table_id, data_detail) {
        let jqueryId = '#' + table_id;
        let table = $(jqueryId);
        let tableLen = 1;
        for (let i = 0; i < data_detail.length; i++) {
            let data = data_detail[i];
            let employee = data.employee;
            let role = employee.role;
            let zone = data.zone;
            let empTitle = employee.full_name;
            let employeeVal = employee.id;
            let empRole = ``;
            if (role && Array.isArray(role)) {
                for (let r = 0; r < role.length; r++) {
                    empRole += `<div><span class="badge badge-soft-primary">${role[r].title}</span></div>`
                }
            }
            let dataZoneShow = ``;
            if (zone && Array.isArray(zone)) {
                for (let z = 0; z < zone.length; z++) {
                    empRole += `<div class="col-12" style="margin-left: -18px"><span class="badge badge-soft-primary mt-1 ml-1">${zone[z].title}</span></div>`
                }
            }
            tableLen++
            let currentId = "chk_sel_" + String(tableLen + 1)
            let checkBox = `<span class="form-check mb-0"><input type="checkbox" class="form-check-input check-select-employee-in-workflow" id="${currentId}"><label class="form-check-label" for="${currentId}"></label></span>`;
            let delAction = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover audit-in-workflow-del-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></span></span></a>`;

            if (empTitle) {
                table.append(`<tr><td>${checkBox}</td><td>${empTitle}<input class="data-in-workflow-employee" type="text" value="${employeeVal}" hidden></td><td></td><td>${empRole}</td><td class="data-in-workflow-zone">${dataZoneShow}</td><td>${delAction}</td></tr>`)
            }
        }
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
                        let coordinates = {};
                        if (row.coordinates) {
                            coordinates = JSON.stringify(row.coordinates)
                        }
                        return `<span class="node-title" data-is-system="true" data-system-code="${row.code}" data-coordinates=${coordinates}>${row.title}</span>`
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
                                                            <i class="fas fa-align-justify" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" disabled></i>
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
                                let employeeIDListStr = JSON.stringify(empData.employeeIDList);
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
                                                    <span class="input-suffix">
                                                        <i class="fa fa-user" data-bs-toggle="offcanvas" data-bs-target="#${canvasId}" aria-controls="offcanvasExample" disabled></i
                                                    ></span>
                                                    <div
                                                    class="offcanvas offcanvas-end" tabindex="-1" id="${canvasId}"
                                                    aria-labelledby="offcanvasTopLabel"
                                                    style="width: 50%; margin-top: 4em;"
                                                    >
                                                    <div class="offcanvas-header">
                                                        <h5 id="offcanvasRightLabel">Add Employee</h5>
                                                    </div>
                                                    <div class="offcanvas-body form-group">
                                                        <input type="hidden" class="employee-out-form-id-list-wf-detail" value=${employeeIDListStr}>
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
                            } else if (row.option_collaborator === 2) {
                                let canvasInWorkflowId = "offcanvasRightInWorkflow" + String(row.order);
                                let boxInWorkflowCompanyId = "select-box-audit-in-workflow-company-" + String(row.order);
                                let boxInWorkflowEmployeeId = "select-box-audit-in-workflow-employee-" + String(row.order);
                                let tableInWorkflowEmployeeId = "datable-audit-in-workflow-employee-" + String(row.order);
                                collabBody = `<div class="form-group">
                                                <label class="form-label">List source</label>
                                                <select
                                                        class="form-select select-box-audit-option"
                                                >
                                                    <option></option>
                                                    <option value="0">In form</option>
                                                    <option value="1">Out form</option>
                                                    <option value="2" selected>In workflow</option>
                                                </select>
                                            </div>
                                            <button
                                            type="button"
                                            class="btn btn-flush-success flush-soft-hover"
                                            data-bs-toggle="offcanvas" 
                                            data-bs-target="#${canvasInWorkflowId}"
                                            aria-controls="offcanvasExample"
                                            style="font-size: 60%"
                                            disabled
                                            >
                                                <span class="icon">
                                                    <span class="feather-icon">
                                                        <i class="fas fa-plus"></i>
                                                    </span>
                                                    <span class="font-3 ml-1">
                                                        Add employee
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
                                                        ></textarea>
                                                        <span class="form-text text-muted">Description what to do</span>
                                                    </div>
                                                    <br><br>
                                                    <div class="modal-footer">
                                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="offcanvas">Close</button>
                                                        <button
                                                                type="button" 
                                                                class="btn btn-primary button-add-audit-in-workflow-employee" 
                                                                data-bs-dismiss="offcanvas"
                                                                id=""
                                                        >Save changes
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
                                loadTableInWorkflow(tableInWorkflowEmployeeId, row.collab_in_workflow)
                            }
                            return `<div class="row">
                                        <div class="col-8">
                                            <i class="fas fa-align-justify wf-detail-loaded" data-bs-toggle="modal" data-bs-target="#${modalAuditId}"></i>
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