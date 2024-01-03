// LoadData
class NodeLoadDataHandle {
    static btnAddNode = $('#btn-add-new-node-create');
    static nodeModalTitleEle = $('#modal-node-name-create');
    static nodeModalDescriptionEle = $('#modal-node-description-create');
    static transEle = $('#node-trans-factory');
    static dataSystemNode = [
        {
            'id': 'abccf657-7dce-4a14-9601-f6c4c4f2722a',
            'title': NodeLoadDataHandle.transEle.attr('data-node-initial'),
            'code': 'initial',
            'code_node_system': 'initial',
            'is_system': true,
            'order': 1,
            'workflow': null,
        },
        {
            'id': '1fbb680e-3521-424a-8523-9f7a34ce867e',
            'title': NodeLoadDataHandle.transEle.attr('data-node-approved'),
            'code': 'approved',
            'code_node_system': 'approved',
            'is_system': true,
            'order': 2,
            'workflow': null,
        },
        {
            'id': '580f887c-1280-44ea-b275-8cb916543b10',
            'title': NodeLoadDataHandle.transEle.attr('data-node-completed'),
            'code': 'completed',
            'code_node_system': 'completed',
            'is_system': true,
            'order': 3,
            'workflow': null,
        }
    ];
    static dataSource = [
        {'id': 3, 'title': 'In workflow'},
        {'id': 2, 'title': 'Out form'},
        {'id': 1, 'title': 'In form'},
    ];
    static dataSourceJSON = {
        1: {'id': 1, 'title': 'In form'},
        2: {'id': 2, 'title': 'Out form'},
        3: {'id': 3, 'title': 'In workflow'},
    };
    static dataInWFOption = [
        {'id': 2, 'title': NodeLoadDataHandle.transEle.attr('data-select-employee')},
        {'id': 1, 'title': NodeLoadDataHandle.transEle.attr('data-select-position')},
        {'id': 0, 'title': NodeLoadDataHandle.transEle.attr('data-choose')},
    ];
    static dataPosition = [
        {'id': 3, 'title': NodeLoadDataHandle.transEle.attr('data-select-beneficiary')},
        {'id': 2, 'title': NodeLoadDataHandle.transEle.attr('data-select-2nd-manager')},
        {'id': 1, 'title': NodeLoadDataHandle.transEle.attr('data-select-1st-manager')},
    ];

    static loadSystemNode() {
        NodeDataTableHandle.dataTableNode();
        for (let data of NodeLoadDataHandle.dataSystemNode) {
            let newRow = NodeDataTableHandle.tableNode.DataTable().row.add(data).node();
            NodeLoadDataHandle.loadInitDataRow(newRow);
            if (data?.['code'] === 'initial') {
                newRow.querySelector('.check-done-action').removeAttribute('hidden');
                newRow.querySelector('.check-fail-action').setAttribute('hidden', 'true');
            }
        }
        return true;
    };

    static loadHTMLAction(is_system_node = false) {
        let actionEle = ``;
        let nodeActionRaw = $('#wf_action').text();
        if (nodeActionRaw) {
            let nodeAction = JSON.parse(nodeActionRaw);
            let inputEle = ``;
            if (is_system_node === true) {
                for (let key in nodeAction) {
                    if (String(key) === "0") {
                        inputEle = `<input type="checkbox" class="form-check-input check-action-node" data-id="${String(key)}" checked disabled>`;
                    } else {
                        inputEle = `<input type="checkbox" class="form-check-input check-action-node" data-id="${String(key)}" disabled>`;
                    }
                    actionEle += `<li class="d-flex align-items-center justify-content-between mb-3">
                            <div class="media d-flex align-items-center">
                                <div class="media-body">
                                    <div>
                                        <div class="node-action">${nodeAction[key]}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="form-check form-check-theme ms-3">
                                ${inputEle}
                            </div>
                        </li>`;
                }
            } else {
                for (let key in nodeAction) {
                    if (String(key) === "0") {
                        inputEle = `<input type="checkbox" class="form-check-input check-action-node" data-id="${String(key)}" disabled>`
                    } else {
                        inputEle = `<input type="checkbox" class="form-check-input check-action-node" data-id="${String(key)}">`;
                    }
                    actionEle += `<li class="d-flex align-items-center justify-content-between mb-3">
                            <div class="media d-flex align-items-center">
                                <div class="media-body">
                                    <div>
                                        <div class="node-action">${nodeAction[key]}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="form-check form-check-theme ms-3">
                                ${inputEle}
                            </div>
                        </li>`
                }
            }
        }
        return actionEle
    };

    static loadBoxListSource(ele, dataSource = null) {
        if (!dataSource) {
            dataSource = NodeLoadDataHandle.dataSource;
        }
        ele.initSelect2({
            data: dataSource,
        });
        return true;
    };

    static loadBoxPropertyEmployee(ele, dataProp = {}) {
        ele.initSelect2({
            data: dataProp,
            disabled: !(ele.attr('data-url')),
        });
        return true;
    };

    static loadBoxCompany(ele, dataCompany = {}) {
        ele.initSelect2({
            data: dataCompany,
            disabled: !(ele.attr('data-url')),
        });
        return true;
    };

    static loadBoxRole(ele, dataRole = {}) {
        ele.initSelect2({
            data: dataRole,
            disabled: !(ele.attr('data-url')),
            'allowClear': true,
        });
        return true;
    };

    static loadBoxInWFOption(ele, dataInWFOption = null) {
        if (!dataInWFOption) {
            dataInWFOption = NodeLoadDataHandle.dataInWFOption;
        }
        ele.initSelect2({
            data: dataInWFOption,
            'allowClear': true,
        });
        return true;
    };

    static loadBoxPosition(ele, dataPosition = null) {
        if (!dataPosition) {
            dataPosition = NodeLoadDataHandle.dataPosition;
        }
        ele.initSelect2({
            data: dataPosition,
        });
        return true;
    };

    static loadBoxEmployee(ele, dataEmployee = {}) {
        let companyVal = $(ele[0].closest('.collab-in-workflow-area').querySelector('.box-in-workflow-company')).val();
        let roleVal = $(ele[0].closest('.collab-in-workflow-area').querySelector('.box-in-workflow-role')).val();
        ele.initSelect2({
            data: dataEmployee,
            'dataParams': {'company_id': companyVal, 'role__id': roleVal},
            disabled: !(ele.attr('data-url')),
            templateResult: function (state) {
                let groupHTML = `<span class="badge badge-soft-primary">${state.data?.group?.title ? state.data.group.title : "_"}</span>`
                let activeHTML = state.data?.is_active === true ? `<span class="badge badge-success"></span>` : `<span class="badge badge-light"></span>`;
                return $(`<span>${state.text} ${activeHTML} ${groupHTML}</span>`);
            },
        });
        return true;
    };

    static loadAddRowTableNode() {
        let dataTable = NodeDataTableHandle.tableNode.DataTable();
        let tableLen = NodeDataTableHandle.tableNode[0].tBodies[0].rows.length;
        let order = (tableLen - 1);
        let title = NodeLoadDataHandle.nodeModalTitleEle.val();
        let remark = NodeLoadDataHandle.nodeModalDescriptionEle.val();
        let data = {
            'title': title,
            'code': '',
            'remark': remark,
            'actions': [],
            'option_collaborator': 0,
            'zone_initial_node': {},
            'order': order,
            'is_system': false,
            'code_node_system': '',
            'condition': [],
            'collab_in_form': {},
            'collab_out_form': {},
            'collab_in_workflow': [],
            'coordinates': {},
        };
        let newRow = dataTable.row.add(data).node();
        NodeLoadDataHandle.loadInitDataRow(newRow);
        let approvedRow = NodeDataTableHandle.tableNode[0].querySelector('[data-node-code="approved"]').closest('tr');
        $(newRow).detach().insertBefore(approvedRow);
        // Load zone DD
        NodeLoadDataHandle.loadZoneDD(newRow, true);
        NodeLoadDataHandle.loadZoneHiddenDD(newRow, true);
        return true;
    };

    static loadInitDataRow(row) {
        // init DataTable
        let tableInitial = row.querySelector('.collab-initial-area')?.querySelector('.table-initial-node-collaborator');
        NodeDataTableHandle.dataTableInitial($(tableInitial));
        NodeLoadDataHandle.loadRowTableInitialNode(row);
        let tableOutFormEmployee = row.querySelector('.collab-out-form-area')?.querySelector('.table-out-form-employee');
        if (tableOutFormEmployee) {
            $.fn.callAjax2({
                    'url': $(tableOutFormEmployee).attr('data-url'),
                    'method': $(tableOutFormEmployee).attr('data-method'),
                    'isDropdown': true,
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('employee_list') && Array.isArray(data.employee_list)) {
                            NodeDataTableHandle.dataTableCollabOutFormEmployee($(tableOutFormEmployee));
                            $(tableOutFormEmployee).DataTable().rows.add(data.employee_list).draw();
                        }
                    }
                }
            )
        }
        let tableInWFEmployee = row.querySelector('.collab-in-workflow-area')?.querySelector('.table-in-workflow-employee');
        NodeDataTableHandle.dataTableCollabInWFEmployee($(tableInWFEmployee));
        // init select2
        if (row.querySelector('.box-list-source')) {
            NodeLoadDataHandle.loadBoxListSource($(row.querySelector('.box-list-source')));
        }
        if (row.querySelector('.box-in-form-property')) {
            NodeLoadDataHandle.loadBoxPropertyEmployee($(row.querySelector('.box-in-form-property')));
        }
        if (row.querySelector('.box-in-workflow-company')) {
            NodeLoadDataHandle.loadBoxCompany($(row.querySelector('.box-in-workflow-company')));
        }
        if (row.querySelector('.box-in-workflow-role')) {
            NodeLoadDataHandle.loadBoxRole($(row.querySelector('.box-in-workflow-role')));
        }
        if (row.querySelector('.box-in-workflow-option')) {
            NodeLoadDataHandle.loadBoxInWFOption($(row.querySelector('.box-in-workflow-option')));
        }
        if (row.querySelector('.box-in-workflow-position')) {
            NodeLoadDataHandle.loadBoxPosition($(row.querySelector('.box-in-workflow-position')));
        }
        if (row.querySelector('.box-in-workflow-employee')) {
            NodeLoadDataHandle.loadBoxEmployee($(row.querySelector('.box-in-workflow-employee')));
        }
        return true;
    };

    static loadRowTableInitialNode(row) {
        let tableInitial = row.querySelector('.collab-initial-area')?.querySelector('.table-initial-node-collaborator');
        let dataInitial = {
            'title': NodeLoadDataHandle.transEle.attr('data-creator'),
            'group': {},
            'role': [],
        }
        $(tableInitial).DataTable().row.add(dataInitial).draw().node();
        return true;
    };

    static loadZoneDD(row, is_created = false) {
        let result = ``;
        if (is_created === false) { // Case Update Exist Nodes
            let eleTitle = row?.querySelector('.table-row-title');
            if (eleTitle) {
                let dataRowRaw = eleTitle.getAttribute('data-row');
                if (dataRowRaw) {
                    let is_edit_all_zone = false;
                    if (row.querySelector('.checkbox-node-zone-all:checked')) {
                        is_edit_all_zone = true;
                    }
                    let zone_list = [];
                    for (let eleChecked of row?.querySelectorAll('.checkbox-node-zone:checked')) {
                        zone_list.push(parseInt($(eleChecked).attr('data-id')));
                    }
                    if (is_edit_all_zone === true) {
                        result += `<li class="d-flex align-items-center justify-content-between mb-3">
                                        <div class="d-flex align-items-center">
                                            <span class="badge badge-soft-success node-zone-title">${NodeLoadDataHandle.transEle.attr('data-zone-all-data')}</span> 
                                        </div>
                                        <div class="form-check form-check-theme ms-3">
                                            <input type="checkbox" class="form-check-input checkbox-node-zone-all" checked>
                                        </div>
                                    </li>`;
                    } else {
                        result += `<li class="d-flex align-items-center justify-content-between mb-3">
                                        <div class="d-flex align-items-center">
                                            <span class="badge badge-soft-success node-zone-title">${NodeLoadDataHandle.transEle.attr('data-zone-all-data')}</span> 
                                        </div>
                                        <div class="form-check form-check-theme ms-3">
                                            <input type="checkbox" class="form-check-input checkbox-node-zone-all">
                                        </div>
                                    </li>`;
                    }
                    let table = document.getElementById('table_workflow_zone');
                    if (!table.querySelector('.dataTables_empty')) {
                        for (let i = 0; i < table.tBodies[0].rows.length; i++) {
                            let row = table.tBodies[0].rows[i];
                            let title = row.children[1].children[0].innerHTML;
                            if (zone_list.includes(i + 1)) {
                                result += `<li class="d-flex align-items-center justify-content-between mb-3">
                                            <div class="d-flex align-items-center">
                                                <span class="badge badge-soft-success node-zone-title">${title}</span> 
                                            </div>
                                            <div class="form-check form-check-theme ms-3">
                                                <input type="checkbox" class="form-check-input checkbox-node-zone" data-id="${i + 1}" data-title="${title}" checked>
                                            </div>
                                        </li>`;
                            } else {
                                result += `<li class="d-flex align-items-center justify-content-between mb-3">
                                            <div class="d-flex align-items-center">
                                                <span class="badge badge-soft-success node-zone-title">${title}</span> 
                                            </div>
                                            <div class="form-check form-check-theme ms-3">
                                                <input type="checkbox" class="form-check-input checkbox-node-zone" data-id="${i + 1}" data-title="${title}">
                                            </div>
                                        </li>`;
                            }
                        }
                        for (let eleZoneList of row?.querySelectorAll('.node-zone-list')) {
                            if ($(eleZoneList).empty()) {
                                $(eleZoneList).append(result);
                            }
                        }
                    }
                    return true;
                }
            }
        } else { // Case Create New Node
            result += `<li class="d-flex align-items-center justify-content-between mb-3">
                                <div class="d-flex align-items-center">
                                    <span class="badge badge-soft-success node-zone-title">${NodeLoadDataHandle.transEle.attr('data-zone-all-data')}</span>
                                </div>
                                <div class="form-check form-check-theme ms-3">
                                    <input type="checkbox" class="form-check-input checkbox-node-zone-all">
                                </div>
                            </li>`;
            let table = document.getElementById('table_workflow_zone');
            if (!table.querySelector('.dataTables_empty')) {
                for (let i = 0; i < table.tBodies[0].rows.length; i++) {
                    let row = table.tBodies[0].rows[i];
                    let title = row.children[1].children[0].innerHTML;
                    result += `<li class="d-flex align-items-center justify-content-between mb-3">
                                <div class="d-flex align-items-center">
                                    <span class="badge badge-soft-success node-zone-title">${title}</span>
                                </div>
                                <div class="form-check form-check-theme ms-3">
                                    <input type="checkbox" class="form-check-input checkbox-node-zone" data-id="${i + 1}" data-title="${title}">
                                </div>
                            </li>`;
                }
                for (let eleZoneList of row?.querySelectorAll('.node-zone-list')) {
                    if ($(eleZoneList).empty()) {
                        $(eleZoneList).append(result);
                    }
                }
            }
            return true;
        }
    };

    static loadZoneHiddenDD(row, is_created = false) {
        let result = ``;
        if (is_created === false) { // Case Update Exist Nodes
            let eleTitle = row?.querySelector('.table-row-title');
            if (eleTitle) {
                let dataRowRaw = eleTitle.getAttribute('data-row');
                if (dataRowRaw) {
                    let zone_list = [];
                    for (let eleChecked of row?.querySelectorAll('.checkbox-node-zone-hidden:checked')) {
                        zone_list.push(parseInt($(eleChecked).attr('data-id')));
                    }
                    let table = document.getElementById('table_workflow_zone');
                    if (!table.querySelector('.dataTables_empty')) {
                        for (let i = 0; i < table.tBodies[0].rows.length; i++) {
                            let row = table.tBodies[0].rows[i];
                            let title = row.children[1].children[0].innerHTML;
                            if (zone_list.includes(i + 1)) {
                                result += `<li class="d-flex align-items-center justify-content-between mb-3">
                                            <div class="d-flex align-items-center">
                                                <span class="badge badge-soft-warning node-zone-title">${title}</span> 
                                            </div>
                                            <div class="form-check form-check-theme ms-3">
                                                <input type="checkbox" class="form-check-input checkbox-node-zone-hidden" data-id="${i + 1}" data-title="${title}" checked>
                                            </div>
                                        </li>`;
                            } else {
                                result += `<li class="d-flex align-items-center justify-content-between mb-3">
                                            <div class="d-flex align-items-center">
                                                <span class="badge badge-soft-warning node-zone-title">${title}</span>  
                                            </div>
                                            <div class="form-check form-check-theme ms-3">
                                                <input type="checkbox" class="form-check-input checkbox-node-zone-hidden" data-id="${i + 1}" data-title="${title}">
                                            </div>
                                        </li>`;
                            }
                        }
                        for (let eleZoneList of row?.querySelectorAll('.node-zone-hidden-list')) {
                            if ($(eleZoneList).empty()) {
                                $(eleZoneList).append(result);
                            }
                        }
                    }
                    return true;
                }
            }
        } else { // Case Create New Node
            let table = document.getElementById('table_workflow_zone');
            if (!table.querySelector('.dataTables_empty')) {
                for (let i = 0; i < table.tBodies[0].rows.length; i++) {
                    let row = table.tBodies[0].rows[i];
                    let title = row.children[1].children[0].innerHTML;
                    result += `<li class="d-flex align-items-center justify-content-between mb-3">
                                <div class="d-flex align-items-center">
                                    <span class="badge badge-soft-warning node-zone-title">${title}</span>
                                </div>
                                <div class="form-check form-check-theme ms-3">
                                    <input type="checkbox" class="form-check-input checkbox-node-zone-hidden" data-id="${i + 1}" data-title="${title}">
                                </div>
                            </li>`;
                }
                for (let eleZoneList of row?.querySelectorAll('.node-zone-hidden-list')) {
                    if ($(eleZoneList).empty()) {
                        $(eleZoneList).append(result);
                    }
                }
            }
            return true;
        }
    };

    static loadZoneDDAllTable() {
        for (let i = 0; i < NodeDataTableHandle.tableNode[0].tBodies[0].rows.length; i++) {
            let row = NodeDataTableHandle.tableNode[0].tBodies[0].rows[i];
            NodeLoadDataHandle.loadZoneDD(row);
            NodeLoadDataHandle.loadZoneHiddenDD(row);
        }
        // set zoneAllData = True for initial node if not zone or hidden zone checked
        let initialArea = NodeDataTableHandle.tableNode[0].querySelector('.collab-initial-area');
        if (initialArea) {
            if (initialArea.querySelectorAll('.checkbox-node-zone:checked').length === 0 && initialArea.querySelectorAll('.checkbox-node-zone-hidden:checked').length === 0) {
                initialArea.querySelector('.checkbox-node-zone-all').checked = true;
            }
        }
    };

    static loadZoneShow(ele) {
        let zone_list = [];
        let zone_json_list = [];
        let collabArea = ele?.closest('.collab-area');
        let eleZoneSubmit = collabArea?.querySelector('.node-zone-submit');
        let eleZoneJSonSubmit = collabArea?.querySelector('.node-zone-json-submit');
        for (let eleChecked of collabArea?.querySelectorAll('.checkbox-node-zone:checked')) {
            zone_list.push(parseInt($(eleChecked).attr('data-id')));
            zone_json_list.push({
                'id': parseInt($(eleChecked).attr('data-id')),
                'title': $(eleChecked).attr('data-title')
            });
        }
        if (eleZoneSubmit) {
            $(eleZoneSubmit).val(JSON.stringify(zone_list));
        }
        if (eleZoneJSonSubmit) {
            $(eleZoneJSonSubmit).val(JSON.stringify(zone_json_list));
        }
    };

    static loadZoneHiddenShow(ele) {
        let zone_list = [];
        let zone_json_list = [];
        let collabArea = ele?.closest('.collab-area');
        let eleZoneSubmit = collabArea?.querySelector('.node-zone-hidden-submit');
        let eleZoneJSonSubmit = collabArea?.querySelector('.node-zone-hidden-json-submit');
        for (let eleChecked of collabArea?.querySelectorAll('.checkbox-node-zone-hidden:checked')) {
            zone_list.push(parseInt($(eleChecked).attr('data-id')));
            zone_json_list.push({
                'id': parseInt($(eleChecked).attr('data-id')),
                'title': $(eleChecked).attr('data-title')
            });
        }
        if (eleZoneSubmit) {
            $(eleZoneSubmit).val(JSON.stringify(zone_list));
        }
        if (eleZoneJSonSubmit) {
            $(eleZoneJSonSubmit).val(JSON.stringify(zone_json_list));
        }
    };

    static loadAreaByListSource(ele) {
        let row = ele.closest('tr');
        for (let area of row.querySelectorAll('.collab-area')) {
            area.setAttribute('hidden', 'true');
        }
        if ($(ele).val() === '1') {
            row.querySelector('.collab-in-form-area').removeAttribute('hidden');
        } else if ($(ele).val() === '2') {
            row.querySelector('.collab-out-form-area').removeAttribute('hidden');
        } else if ($(ele).val() === '3') {
            row.querySelector('.collab-in-workflow-area').removeAttribute('hidden');
        }
        NodeLoadDataHandle.loadZoneDD(row, true); // reset zones
        NodeLoadDataHandle.loadZoneHiddenDD(row, true); // reset hidden zones
    };

    static loadOutFormEmployeeShow(ele) {
        let emp_list = [];
        let eleOFESubmit = ele.closest('.collab-out-form-area').querySelector('.node-out-form-employee-submit');
        let table = ele.closest('.collab-out-form-area').querySelector('.table-out-form-employee');
        let eleEmpShow = ele.closest('.collab-out-form-area').querySelector('.node-out-form-employee-show');
        $(eleEmpShow).empty();
        $(table).DataTable().rows().every(function () {
            let row = this.node();
            let eleCheck = row.querySelector('.table-row-checkbox-out-form');
            if (eleCheck.checked === true) {
                $(eleEmpShow).append(`<span class="badge badge-soft-primary mr-1">${$(eleCheck).attr('data-title')}</span>`);
                emp_list.push($(eleCheck).attr('data-id'));
            }
        });

        $(eleOFESubmit).val(JSON.stringify(emp_list));
    };

    static loadInWFArea(ele) {
        if ($(ele).val()) {
            let dataSelected = SelectDDControl.get_data_from_idx($(ele), $(ele).val());
            let positionArea = ele.closest('.collab-in-workflow-area')?.querySelector('.position-area');
            let employeeAreaList = ele.closest('.collab-in-workflow-area')?.querySelectorAll('.employee-area');
            if (positionArea && employeeAreaList) {
                positionArea.setAttribute('hidden', 'true');
                for (let employeeArea of employeeAreaList) {
                    employeeArea.setAttribute('hidden', 'true');
                }
                if (dataSelected?.['id'] === 1) {
                    if (positionArea) {
                        positionArea.removeAttribute('hidden');
                    }
                }
                if (dataSelected?.['id'] === 2) {
                    if (employeeAreaList) {
                        for (let employeeArea of employeeAreaList) {
                            employeeArea.removeAttribute('hidden');
                        }
                    }
                }
            }
        }
    };

    static loadInWFEmployeeShow(ele) {
        let table = ele.closest('.collab-in-workflow-area').querySelector('.table-in-workflow-employee');
        let eleBoxOption = ele.closest('.collab-in-workflow-area').querySelector('.box-in-workflow-option');
        let eleZoneJSonSubmit = ele.closest('.collab-in-workflow-area').querySelector('.node-zone-json-submit');
        let eleZoneHiddenJSonSubmit = ele.closest('.collab-in-workflow-area').querySelector('.node-zone-hidden-json-submit');
        if ($(eleBoxOption).val()) {
            let dataSelected = SelectDDControl.get_data_from_idx($(eleBoxOption), $(eleBoxOption).val());
            if (dataSelected?.['id'] === 1) {  // by position
                let eleBoxPosition = ele.closest('.collab-in-workflow-area').querySelector('.box-in-workflow-position');
                if ($(eleBoxPosition).val()) {
                    let dataPosition = SelectDDControl.get_data_from_idx($(eleBoxPosition), $(eleBoxPosition).val());
                    let is_edit_all_zone = false;
                    if (ele.closest('.collab-in-workflow-area').querySelector('.checkbox-node-zone-all:checked')) {
                        is_edit_all_zone = true;
                    }
                    let zone = [];
                    if ($(eleZoneJSonSubmit).val()) {
                        zone = JSON.parse($(eleZoneJSonSubmit).val());
                    }
                    let zoneHidden = [];
                    if ($(eleZoneHiddenJSonSubmit).val()) {
                        zoneHidden = JSON.parse($(eleZoneHiddenJSonSubmit).val());
                    }
                    let data = {
                        'in_wf_option': 1,
                        'position_choice': dataPosition,
                        'employee': {},
                        'zone': zone,
                        'zone_hidden': zoneHidden,
                        'is_edit_all_zone': is_edit_all_zone,
                    }
                    $(table).DataTable().row.add(data).draw().node();
                }
            }
            if (dataSelected?.['id'] === 2) {  // by employee
                let eleBoxEmployee = ele.closest('.collab-in-workflow-area').querySelector('.box-in-workflow-employee');
                if ($(eleBoxEmployee).val()) {
                    let dataEmployee = SelectDDControl.get_data_from_idx($(eleBoxEmployee), $(eleBoxEmployee).val());
                    let is_edit_all_zone = false;
                    if (ele.closest('.collab-in-workflow-area').querySelector('.checkbox-node-zone-all:checked')) {
                        is_edit_all_zone = true;
                    }
                    let zone = [];
                    if ($(eleZoneJSonSubmit).val()) {
                        zone = JSON.parse($(eleZoneJSonSubmit).val());
                    }
                    let zoneHidden = [];
                    if ($(eleZoneHiddenJSonSubmit).val()) {
                        zoneHidden = JSON.parse($(eleZoneHiddenJSonSubmit).val());
                    }
                    let data = {
                        'in_wf_option': 2,
                        'position_choice': {},
                        'employee': dataEmployee,
                        'zone': zone,
                        'zone_hidden': zoneHidden,
                        'is_edit_all_zone': is_edit_all_zone,
                    }
                    $(table).DataTable().row.add(data).draw().node();
                    // update zoneHiddenEmployee for validate zone hidden
                    // NodeValidateHandle.validateZoneHiddenEmployeeSetup(dataEmployee?.['id'], zoneHidden);
                }
            }
        }
    };

    static loadDoneFailAction(ele) {
        let row = ele.closest('tr');
        if (row.querySelectorAll('.check-action-node:checked').length > 0) {
            row.querySelector('.check-done-action').removeAttribute('hidden');
            row.querySelector('.check-fail-action').setAttribute('hidden', 'true');
        } else {
            row.querySelector('.check-fail-action').removeAttribute('hidden');
            row.querySelector('.check-done-action').setAttribute('hidden', 'true');
        }
    };

    static loadDoneFailCollab(ele) {
        let is_done = false;
        let row = ele.closest('tr');
        let modalCollab = ele.closest('.modal-collab');
        let boxListSource = modalCollab.querySelector('.box-list-source');
        if ($(boxListSource).val() === '1') {
            if ($(modalCollab?.querySelector('.box-in-form-property')).val()) {
                is_done = true;
            }
        } else if ($(boxListSource).val() === '2') {
            if ($(modalCollab?.querySelector('.node-out-form-employee-submit')).val()) {
                if (JSON.parse($(modalCollab?.querySelector('.node-out-form-employee-submit')).val()).length > 0) {
                    is_done = true;
                }
            }
        } else if ($(boxListSource).val() === '3') {
            let tableInWF = modalCollab?.querySelector('.table-in-workflow-employee');
            if (!tableInWF.querySelector('.dataTables_empty')) {
                is_done = true;
            }
        }
        if (is_done === true) {
            row.querySelector('.check-done-collab').removeAttribute('hidden');
            row.querySelector('.check-fail-collab').setAttribute('hidden', 'true');
        } else {
            row.querySelector('.check-fail-collab').removeAttribute('hidden');
            row.querySelector('.check-done-collab').setAttribute('hidden', 'true');
        }
    };

    static loadCheckGroupAction(ele) {
        let groupCheckAction = {
            '1': ['1', '2', '3'],
            '2': ['1', '2'],
            '3': ['1', '3'],
            '4': ['4'],
            '5': ['5'],
        }
        let groupUnCheckAction = {
            '1': [],
            '2': ['1', '3'],
            '3': ['1', '2'],
            '4': [],
            '5': [],
        }
        let checkedID = $(ele).attr('data-id');
        let row = ele.closest('tr');
        if (ele.checked === true) {
            for (let eleCheck of row.querySelectorAll('.check-action-node')) {
                if ($(eleCheck).attr('data-id') !== '0') {
                    eleCheck.checked = groupCheckAction[checkedID].includes($(eleCheck).attr('data-id'));
                }
            }
        } else {
            for (let eleCheck of row.querySelectorAll('.check-action-node')) {
                if ($(eleCheck).attr('data-id') !== '0') {
                    eleCheck.checked = groupUnCheckAction[checkedID].includes($(eleCheck).attr('data-id'));
                }
            }
        }
    };

    // LOAD DETAIL PAGE
    static loadDetailNode(data) {
        NodeDataTableHandle.dataTableNode();
        NodeDataTableHandle.tableNode.DataTable().rows.add(data).draw();
        NodeLoadDataHandle.loadDetailNodeActionAndCollab();
    };

    static loadDetailNodeActionAndCollab() {
        NodeDataTableHandle.tableNode.DataTable().rows().every(function () {
            let row = this.node();
            let dataRowRaw = row?.querySelector('.table-row-title')?.getAttribute('data-row');
            if (dataRowRaw) {
                let dataRow = JSON.parse(dataRowRaw);
                NodeLoadDataHandle.loadZoneDD(row);
                NodeLoadDataHandle.loadZoneHiddenDD(row);
                NodeLoadDataHandle.loadDoneActionAndCollab(row);
                // Action
                for (let eleCheck of row.querySelectorAll('.check-action-node')) {
                    if (dataRow?.['actions'].includes(parseInt($(eleCheck).attr('data-id')))) {
                        eleCheck.checked = true;
                    }
                }
                // Collab
                NodeLoadDataHandle.loadDetailNodeCollab(row, dataRow);
            }
        });
    };

    static loadDetailNodeCollab(row, dataRow) {
        let modalCollab = row.querySelector('.modal-collab');
        if (dataRow?.['is_system'] === true) { // SYSTEM NODES
            if (dataRow?.['code'] === 'initial') {
                let initialArea = modalCollab.querySelector('.collab-initial-area');
                let zone_initial_node = [];
                for (let zone of dataRow?.['zone_initial_node']) {
                    zone_initial_node.push(zone?.['order']);
                }
                let zone_hidden_initial_node = [];
                for (let zone of dataRow?.['zone_hidden_initial_node']) {
                    zone_hidden_initial_node.push(zone?.['order']);
                }
                let tableInitial = initialArea.querySelector('.table-initial-node-collaborator');
                NodeDataTableHandle.dataTableInitial($(tableInitial));
                NodeLoadDataHandle.loadRowTableInitialNode(row);
                NodeLoadDataHandle.loadZoneDD(row);
                NodeLoadDataHandle.loadZoneHiddenDD(row);
                if (dataRow?.['is_edit_all_zone'] === true) {
                    initialArea.querySelector('.checkbox-node-zone-all').checked = true;
                }
                for (let eleCheck of initialArea.querySelectorAll('.checkbox-node-zone')) {
                    if (zone_initial_node.includes(parseInt($(eleCheck).attr('data-id')))) {
                        eleCheck.checked = true;
                    }
                }
                for (let eleCheck of initialArea.querySelectorAll('.checkbox-node-zone-hidden')) {
                    if (zone_hidden_initial_node.includes(parseInt($(eleCheck).attr('data-id')))) {
                        eleCheck.checked = true;
                    }
                }
            }
        } else { // COLLAB NODES
            NodeLoadDataHandle.loadInitDataRow(row);
            // Load boxListSource
            let boxListSource = modalCollab.querySelector('.box-list-source');
            $(boxListSource).empty();
            NodeLoadDataHandle.loadBoxListSource($(boxListSource));
            let optionCollab = dataRow?.['option_collaborator'] + 1;
            $(boxListSource).val(optionCollab);
            let boxRender = row?.querySelector('.form-group-data-source')?.querySelector('.select2-selection__rendered');
            if (boxRender) {
                boxRender.innerHTML = NodeLoadDataHandle.dataSourceJSON[optionCollab]?.['title'];
                boxRender.setAttribute('title', NodeLoadDataHandle.dataSourceJSON[optionCollab]?.['title']);
            }
            NodeLoadDataHandle.loadAreaByListSource(boxListSource);
            // Load detail collab depend on option_collaborator
            if (dataRow?.['option_collaborator'] === 0) { // In Form
                let dataIF = dataRow?.['collab_in_form'];
                let IFArea = modalCollab.querySelector('.collab-in-form-area');
                let boxProp = IFArea?.querySelector('.box-in-form-property');
                let eleZoneSubmit = IFArea?.querySelector('.node-zone-submit');
                let eleZoneJSonSubmit = IFArea?.querySelector('.node-zone-json-submit');
                let eleZoneHiddenSubmit = IFArea?.querySelector('.node-zone-hidden-submit');
                let eleZoneHiddenJSonSubmit = IFArea?.querySelector('.node-zone-hidden-json-submit');
                let eleZoneDD = IFArea?.querySelector('.dropdown-zone');
                $(boxProp).empty();
                NodeLoadDataHandle.loadBoxPropertyEmployee($(boxProp), dataIF?.['app_property']);
                // zone
                if (dataIF?.['is_edit_all_zone'] === true) {
                    IFArea.querySelector('.checkbox-node-zone-all').checked = true;
                }
                if (eleZoneJSonSubmit) {
                    $(eleZoneJSonSubmit).val(JSON.stringify(dataIF?.['zone']));
                }
                let zone_list = [];
                for (let zone of dataIF?.['zone']) {
                    zone_list.push(zone?.['order']);
                }
                if (eleZoneSubmit) {
                    $(eleZoneSubmit).val(JSON.stringify(zone_list));
                }
                for (let eleCheck of eleZoneDD.querySelectorAll('.checkbox-node-zone')) {
                    if (zone_list.includes(parseInt($(eleCheck).attr('data-id')))) {
                        eleCheck.checked = true;
                        NodeLoadDataHandle.loadZoneShow(eleCheck);
                    }
                }
                // zone hidden
                if (eleZoneHiddenJSonSubmit) {
                    $(eleZoneHiddenJSonSubmit).val(JSON.stringify(dataIF?.['zone_hidden']));
                }
                let zone_hidden_list = [];
                for (let zone of dataIF?.['zone_hidden']) {
                    zone_hidden_list.push(zone?.['order']);
                }
                if (eleZoneHiddenSubmit) {
                    $(eleZoneHiddenSubmit).val(JSON.stringify(zone_hidden_list));
                }
                for (let eleCheck of IFArea.querySelectorAll('.checkbox-node-zone-hidden')) {
                    if (zone_hidden_list.includes(parseInt($(eleCheck).attr('data-id')))) {
                        eleCheck.checked = true;
                        NodeLoadDataHandle.loadZoneHiddenShow(eleCheck);
                    }
                }
            } else if (dataRow?.['option_collaborator'] === 1) { // Out Form
                let dataOF = dataRow['collab_out_form'];
                let OFArea = modalCollab.querySelector('.collab-out-form-area');
                let eleZoneSubmit = OFArea?.querySelector('.node-zone-submit');
                let eleZoneJSonSubmit = OFArea?.querySelector('.node-zone-json-submit');
                let eleZoneHiddenSubmit = OFArea?.querySelector('.node-zone-hidden-submit');
                let eleZoneHiddenJSonSubmit = OFArea?.querySelector('.node-zone-hidden-json-submit');
                let eleZoneDD = OFArea?.querySelector('.dropdown-zone');
                let employee_id_list = [];
                for (let emp of dataOF?.['employee_list']) {
                    employee_id_list.push(emp?.['id']);
                }
                $(OFArea?.querySelector('.node-out-form-employee-submit')).val(JSON.stringify(employee_id_list));
                let tableOutFormEmployee = OFArea?.querySelector('.table-out-form-employee');
                if (tableOutFormEmployee) {
                    $.fn.callAjax2({
                            'url': $(tableOutFormEmployee).attr('data-url'),
                            'method': $(tableOutFormEmployee).attr('data-method'),
                            'isDropdown': true,
                        }
                    ).then(
                        (resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data) {
                                if (data.hasOwnProperty('employee_list') && Array.isArray(data.employee_list)) {
                                    for (let item of data.employee_list) {
                                        if (employee_id_list.includes(item?.['id'])) {
                                            item['is_checked'] = true;
                                        }
                                    }
                                    $(tableOutFormEmployee).DataTable().clear().draw();
                                    $(tableOutFormEmployee).DataTable().rows.add(data.employee_list).draw();
                                    let btnAddEmpOF = OFArea?.querySelector('.button-add-out-form-employee');
                                    NodeLoadDataHandle.loadOutFormEmployeeShow(btnAddEmpOF);
                                }
                            }
                        }
                    )
                }
                // zone
                if (dataOF?.['is_edit_all_zone'] === true) {
                    OFArea.querySelector('.checkbox-node-zone-all').checked = true;
                }
                if (eleZoneJSonSubmit) {
                    if (dataOF?.['zone']) { // set id zone to zone's order
                        for (let zone_detail of dataOF?.['zone']) {
                            if (zone_detail?.['order'] && Number.isInteger(zone_detail?.['order'])) {
                                zone_detail['id'] = zone_detail?.['order'];
                            }
                        }
                    }
                    $(eleZoneJSonSubmit).val(JSON.stringify(dataOF?.['zone']));
                }
                let zone_list = [];
                for (let zone of dataOF?.['zone']) {
                    zone_list.push(zone?.['order']);
                }
                if (eleZoneSubmit) {
                    $(eleZoneSubmit).val(JSON.stringify(zone_list));
                }
                for (let eleCheck of eleZoneDD.querySelectorAll('.checkbox-node-zone')) {
                    if (zone_list.includes(parseInt($(eleCheck).attr('data-id')))) {
                        eleCheck.checked = true;
                        NodeLoadDataHandle.loadZoneShow(eleCheck);
                    }
                }
                // zone hidden
                if (eleZoneHiddenJSonSubmit) {
                    if (dataOF?.['zone_hidden']) { // set id zone to zone's order
                        for (let zone_detail of dataOF?.['zone_hidden']) {
                            if (zone_detail?.['order'] && Number.isInteger(zone_detail?.['order'])) {
                                zone_detail['id'] = zone_detail?.['order'];
                            }
                        }
                    }
                    $(eleZoneHiddenJSonSubmit).val(JSON.stringify(dataOF?.['zone_hidden']));
                }
                let zone_hidden_list = [];
                for (let zone of dataOF?.['zone_hidden']) {
                    zone_hidden_list.push(zone?.['order']);
                }
                if (eleZoneHiddenSubmit) {
                    $(eleZoneHiddenSubmit).val(JSON.stringify(zone_hidden_list));
                }
                for (let eleCheck of OFArea.querySelectorAll('.checkbox-node-zone-hidden')) {
                    if (zone_hidden_list.includes(parseInt($(eleCheck).attr('data-id')))) {
                        eleCheck.checked = true;
                        NodeLoadDataHandle.loadZoneHiddenShow(eleCheck);
                    }
                }
            } else if (dataRow?.['option_collaborator'] === 2) { // In Workflow
                let dataInWF = dataRow?.['collab_in_workflow'];
                let InWFArea = modalCollab?.querySelector('.collab-in-workflow-area');
                let tableInWF = InWFArea?.querySelector('.table-in-workflow-employee');
                let dataPosition = {
                    1: {'id': 1, 'title': NodeLoadDataHandle.transEle.attr('data-select-1st-manager')},
                    2: {'id': 2, 'title': NodeLoadDataHandle.transEle.attr('data-select-2nd-manager')},
                    3: {'id': 3, 'title': NodeLoadDataHandle.transEle.attr('data-select-beneficiary')},
                }
                for (let inWF of dataInWF) {
                    if (inWF?.['position_choice']) {
                        inWF['position_choice'] = dataPosition[inWF['position_choice']];
                    }
                    if (inWF?.['zone']) { // set id zone to zone's order
                        for (let zone_detail of inWF?.['zone']) {
                            if (zone_detail?.['order'] && Number.isInteger(zone_detail?.['order'])) {
                                zone_detail['id'] = zone_detail?.['order'];
                            }
                        }
                    }
                    if (inWF?.['zone_hidden']) { // set id zone to zone's order
                        for (let zone_detail of inWF?.['zone_hidden']) {
                            if (zone_detail?.['order'] && Number.isInteger(zone_detail?.['order'])) {
                                zone_detail['id'] = zone_detail?.['order'];
                            }
                        }
                    }
                }
                $(tableInWF).DataTable().rows.add(dataInWF).draw();
            }
        }
    };

    static loadDoneActionAndCollab(row) {
        row.querySelector('.check-done-action').removeAttribute('hidden');
        row.querySelector('.check-fail-action').setAttribute('hidden', 'true');
        row.querySelector('.check-done-collab').removeAttribute('hidden');
        row.querySelector('.check-fail-collab').setAttribute('hidden', 'true');
    };


}

// DataTable
class NodeDataTableHandle {
    static tableNode = $('#datable-workflow-node-create');
    static propEmployeeInitEle = $('#data-init-property-employee');
    static companyInitEle = $('#data-init-company');
    static roleInitEle = $('#data-init-role');
    static employeeInitEle = $('#data-init-employee');
    static employeeCompanyInitEle = $('#data-init-employee-company');

    static dataTableNode(data) {
        NodeDataTableHandle.tableNode.DataTableDefault({
            data: data ? data : [],
            paging: false,
            info: false,
            columnDefs: [],
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        if (row?.['is_system'] === true) {
                            return `<b><span class="table-row-title text-primary" data-row="${dataRow}" data-node-code="${row?.['code']}">${row?.['title']}</span></b>`;
                        } else {
                            let form = $('#form-create_workflow');
                            if (form.attr('data-method') !== 'GET') {
                                return `<input type="text" class="form-control table-row-title" value="${row?.['title']}" data-row="${dataRow}" data-node-code="${row?.['code']}">`;
                            } else {
                                return `<input type="text" class="form-control table-row-title" value="${row?.['title']}" data-row="${dataRow}" data-node-code="${row?.['code']}" disabled>`;
                            }
                        }
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        if (row?.['is_system'] === true) {
                            return ``;
                        } else {
                            let form = $('#form-create_workflow');
                            if (form.attr('data-method') !== 'GET') {
                               return `<input type="text" class="form-control table-row-remark" value="${row?.['remark'] ? row?.['remark'] : ''}">`;
                            } else {
                               return `<input type="text" class="form-control table-row-remark" value="${row?.['remark'] ? row?.['remark'] : ''}" disabled>`;
                            }
                        }
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        let is_approved_complete = false;
                        let actionEle = NodeLoadDataHandle.loadHTMLAction();
                        if (row?.['is_system'] === true) {
                            actionEle = NodeLoadDataHandle.loadHTMLAction(true);
                            if (['approved', 'completed'].includes(row?.['code'])) {
                                is_approved_complete = true;
                            }
                        }
                        if (is_approved_complete === false) {
                            return `<div class="row">
                                        <div class="col-8">
                                            <div class="btn-group dropdown">
                                                <button 
                                                    type="button"
                                                    class="btn btn-link"
                                                    data-bs-toggle="dropdown" 
                                                    aria-haspopup="true" 
                                                    aria-expanded="false"
                                                >
                                                <i class="fas fa-align-justify" data-bs-toggle="tooltip" data-bs-placement="top" title="click to add action"></i>
                                                </button>
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
                                            <span class="check-done-action" hidden><i class="fas fa-check mt-2 text-green"></i></span>
                                            <span class="check-fail-action"><i class="fas fa-times mt-2 text-red"></i></span>
                                        </div>
                                    </div>`;
                        } else {
                            return `<div class="row">
                                        <div class="col-8">
                                            <button 
                                                type="button"
                                                class="btn btn-link"
                                                disabled
                                            >
                                            <i class="fas fa-align-justify"></i>
                                            </button>
                                        </div>
                                        <div class="col-4">
                                            <span class="check-done-action"><i class="fas fa-check mt-2 text-green"></i></span>
                                            <span class="check-fail-action" hidden><i class="fas fa-times mt-2 text-red"></i></span>
                                        </div>
                                    </div>`
                        }
                    },
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        let idModal = "collabModalWFNode" + String(row?.['order']);
                        let idOutFormCanvas = "outFormCanvas" + String(row?.['order']);
                        let idInWFCanvas = "inWFCanvas" + String(row?.['order']);
                        let is_system = false;
                        if (row?.['is_system'] === true) {
                            is_system = true;
                        }
                        if (is_system === false) {
                            return `<div class="row">
                                        <div class="col-8">
                                            <button 
                                                type="button"
                                                class="btn btn-link btn-node-collab"
                                                data-bs-toggle="modal"
                                                data-bs-target="#${idModal}"
                                            >
                                            <i class="fas fa-align-justify" data-bs-toggle="tooltip" data-bs-placement="top" title="click to add collaborator"></i>
                                            </button>
                                            <div
                                                class="modal fade" id="${idModal}" tabindex="-1" role="dialog"
                                                aria-labelledby="${idModal}" aria-hidden="true"
                                            >
                                                <div class="modal-dialog modal-dialog-centered modal-xl modal-collab" role="document">
                                                    <div class="modal-content">
                                                        <div class="modal-header">
                                                            <h5 class="modal-title">${NodeLoadDataHandle.transEle.attr('data-add-collaborators')}</h5>
                                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                                                <span aria-hidden="true">&times;</span>
                                                            </button>
                                                        </div>
                                                        <div class="modal-body modal-body-collab">
                                                            <div class="row collab-common-area">
                                                                <div class="form-group form-group-data-source">
                                                                    <label class="form-label required">${NodeLoadDataHandle.transEle.attr('data-list-source')}</label>
                                                                    <select
                                                                        class="form-select box-list-source"
                                                                        data-url=""
                                                                        data-method="GET"
                                                                        data-link-detail=""
                                                                        name="list_source"
                                                                        data-keyResp=""
                                                                        required
                                                                    >
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div class="row collab-area collab-in-form-area mb-5">
                                                                <div class="form-group">
                                                                    <label class="form-label">Select field in form</label>
                                                                    <select 
                                                                        class="form-control box-in-form-property"
                                                                        data-url="${NodeDataTableHandle.propEmployeeInitEle.attr('data-url')}"
                                                                        data-method="${NodeDataTableHandle.propEmployeeInitEle.attr('data-method')}"
                                                                        data-keyResp="property_employee_list"
                                                                    >
                                                                    </select>
                                                                </div>
                                                                <div class="row">
                                                                    <div class="col-12 col-md-6 col-lg-6">
                                                                        <div class="form-group">
                                                                            <label class="form-label">${NodeLoadDataHandle.transEle.attr('data-editing-zone')}</label>
                                                                            <input type="hidden" class="node-zone-submit">
                                                                            <input type="hidden" class="node-zone-json-submit">
                                                                            <div class="dropdown-zone">
                                                                                <div data-bs-spy="scroll" data-bs-smooth-scroll="true" class="h-150p position-relative overflow-y-scroll">
                                                                                    <ul class="node-zone-list p-0"></ul>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="col-12 col-md-6 col-lg-6">
                                                                        <div class="form-group">
                                                                            <label class="form-label">${NodeLoadDataHandle.transEle.attr('data-hidden-zone')}</label>
                                                                            <input type="hidden" class="node-zone-hidden-submit">
                                                                            <input type="hidden" class="node-zone-hidden-json-submit">
                                                                            <div class="dropdown-zone">
                                                                                <div data-bs-spy="scroll" data-bs-smooth-scroll="true" class="h-150p position-relative overflow-y-scroll">
                                                                                    <ul class="node-zone-hidden-list p-0"></ul>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="row collab-area collab-out-form-area mb-5" hidden>
                                                                <div class="form-group">
                                                                    <label class="form-label">${NodeLoadDataHandle.transEle.attr('data-employee-list')}</label>
                                                                    <div 
                                                                        class="input-group input-group-out-form-employee mb-3" 
                                                                        data-bs-toggle="offcanvas" 
                                                                        data-bs-target="#${idOutFormCanvas}"
                                                                        aria-controls="${idOutFormCanvas}"
                                                                    >
                                                                        <span class="input-affix-wrapper">
                                                                            <div class="form-control div-input node-out-form-employee-show"></div>
                                                                            <input type="hidden" class="node-out-form-employee-submit">
                                                                            <span class="input-suffix">
                                                                                <div class="btn-group btn-link"><i class="fa fa-user"></i></div>
                                                                            </span>
                                                                        </span>
                                                                    </div>
                                                                    <div class="offcanvas offcanvas-end w-60 mt-4" tabindex="-1" id="${idOutFormCanvas}" aria-labelledby="${idOutFormCanvas}">
                                                                        <div class="offcanvas-header">
                                                                            <h5 id="offcanvasRightLabel">${NodeLoadDataHandle.transEle.attr('data-add-employee')}</h5>
                                                                        </div>
                                                                        <div class="offcanvas-body form-group">
                                                                            <table
                                                                                    class="table nowrap w-100 mb-5 table-out-form-employee"
                                                                                    data-url="${NodeDataTableHandle.employeeInitEle.attr('data-url')}"
                                                                                    data-method="${NodeDataTableHandle.employeeInitEle.attr('data-method')}"
                                                                            >
                                                                                <thead>
                                                                                <tr>
                                                                                    <th>${NodeLoadDataHandle.transEle.attr('data-code')}</th>
                                                                                    <th>${NodeLoadDataHandle.transEle.attr('data-full-name')}</th>
                                                                                    <th>${NodeLoadDataHandle.transEle.attr('data-select-role')}</th>
                                                                                    <th></th>
                                                                                </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                </tbody>
                                                                            </table>
                                                                            <br><br>
                                                                            <div class="modal-footer">
                                                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="offcanvas">${NodeLoadDataHandle.transEle.attr('data-btn-close')}</button>
                                                                                <button
                                                                                        type="button" 
                                                                                        class="btn btn-primary button-add-out-form-employee" 
                                                                                        data-bs-dismiss="offcanvas"
                                                                                >${NodeLoadDataHandle.transEle.attr('data-btn-save')}
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="row">
                                                                    <div class="col-12 col-md-6 col-lg-6">
                                                                        <div class="form-group">
                                                                            <label class="form-label">${NodeLoadDataHandle.transEle.attr('data-editing-zone')}</label>
                                                                            <input type="hidden" class="node-zone-submit">
                                                                            <input type="hidden" class="node-zone-json-submit">
                                                                            <div class="dropdown-zone">
                                                                                <div data-bs-spy="scroll" data-bs-smooth-scroll="true" class="h-150p position-relative overflow-y-scroll">
                                                                                    <ul class="node-zone-list p-0"></ul>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="col-12 col-md-6 col-lg-6">
                                                                        <div class="form-group">
                                                                            <label class="form-label">${NodeLoadDataHandle.transEle.attr('data-hidden-zone')}</label>
                                                                            <input type="hidden" class="node-zone-hidden-submit">
                                                                            <input type="hidden" class="node-zone-hidden-json-submit">
                                                                            <div class="dropdown-zone">
                                                                                <div data-bs-spy="scroll" data-bs-smooth-scroll="true" class="h-150p position-relative overflow-y-scroll">
                                                                                    <ul class="node-zone-hidden-list p-0"></ul>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="row collab-area collab-in-workflow-area mb-5" hidden>
                                                                <div class="row">
                                                                    <div class="col-2">
                                                                        <button
                                                                                type="button"
                                                                                class="btn btn-outline-primary"
                                                                                data-bs-toggle="offcanvas"
                                                                                data-bs-target="#${idInWFCanvas}"
                                                                                aria-controls="${idInWFCanvas}"
                                                                        >
                                                                            <span><span>${NodeLoadDataHandle.transEle.attr('data-add-employee')}</span><span class="icon"><i class="fa-solid fa-plus"></i></span></span>
                                                                        </button>
                                                                    </div>
                                                                    <div class="col-10"></div>
                                                                </div>
                                                                <div class="offcanvas offcanvas-end w-60 mt-4" tabindex="-1" id="${idInWFCanvas}" aria-labelledby="${idInWFCanvas}">
                                                                    <div class="offcanvas-header">
                                                                        <h5 id="offcanvasRightLabel">${NodeLoadDataHandle.transEle.attr('data-add-employee')}</h5>
                                                                    </div>
                                                                    <div class="offcanvas-body form-group">
                                                                        <div class="form-group">
                                                                            <label class="form-label">Select option</label>
                                                                            <select
                                                                                class="form-select box-in-workflow-option"
                                                                                data-url=""
                                                                                data-method="GET"
                                                                                data-keyResp=""
                                                                            >
                                                                            </select>
                                                                        </div>
                                                                        <div class="form-group position-area" hidden>
                                                                            <label class="form-label">${NodeLoadDataHandle.transEle.attr('data-position-select')}</label>
                                                                            <select
                                                                                class="form-select box-in-workflow-position"
                                                                                data-url=""
                                                                                data-method="GET"
                                                                                data-keyResp=""
                                                                            >
                                                                            </select>
                                                                        </div>
                                                                        <div class="form-group employee-area" hidden>
                                                                            <label class="form-label">${NodeLoadDataHandle.transEle.attr('data-select-company')}</label>
                                                                            <select 
                                                                                class="form-control box-in-workflow-company"
                                                                                data-url="${NodeDataTableHandle.companyInitEle.attr('data-url')}"
                                                                                data-method="${NodeDataTableHandle.companyInitEle.attr('data-method')}"
                                                                                data-keyResp="company_list"
                                                                            >
                                                                            </select>
                                                                        </div>
                                                                        <div class="form-group employee-area" hidden>
                                                                            <label class="form-label">${NodeLoadDataHandle.transEle.attr('data-select-role')}</label>
                                                                            <select 
                                                                                class="form-control box-in-workflow-role"
                                                                                data-url="${NodeDataTableHandle.roleInitEle.attr('data-url')}"
                                                                                data-method="${NodeDataTableHandle.roleInitEle.attr('data-method')}"
                                                                                data-keyResp="role_list"
                                                                            >
                                                                            </select>
                                                                        </div>
                                                                        <div class="form-group employee-area" hidden>
                                                                            <label class="form-label">${NodeLoadDataHandle.transEle.attr('data-select-employee')}</label>
                                                                            <select 
                                                                                class="form-control box-in-workflow-employee"
                                                                                data-url="${NodeDataTableHandle.employeeCompanyInitEle.attr('data-url')}"
                                                                                data-method="${NodeDataTableHandle.employeeCompanyInitEle.attr('data-method')}"
                                                                                data-keyResp="employee_company_list"
                                                                                data-keyText="full_name"
                                                                            >
                                                                            </select>
                                                                        </div>
                                                                        <div class="row">
                                                                            <div class="col-12 col-md-6 col-lg-6">
                                                                                <div class="form-group">
                                                                                    <label class="form-label">${NodeLoadDataHandle.transEle.attr('data-editing-zone')}</label>
                                                                                    <input type="hidden" class="node-zone-submit">
                                                                                    <input type="hidden" class="node-zone-json-submit">
                                                                                    <div class="dropdown-zone">
                                                                                        <div data-bs-spy="scroll" data-bs-smooth-scroll="true" class="h-150p position-relative overflow-y-scroll">
                                                                                            <ul class="node-zone-list p-0"></ul>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div class="col-12 col-md-6 col-lg-6">
                                                                                <div class="form-group">
                                                                                    <label class="form-label">${NodeLoadDataHandle.transEle.attr('data-hidden-zone')}</label>
                                                                                    <input type="hidden" class="node-zone-hidden-submit">
                                                                                    <input type="hidden" class="node-zone-hidden-json-submit">
                                                                                    <div class="dropdown-zone">
                                                                                        <div data-bs-spy="scroll" data-bs-smooth-scroll="true" class="h-150p position-relative overflow-y-scroll">
                                                                                            <ul class="node-zone-hidden-list p-0"></ul>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div class="form-group">
                                                                            <label class="form-label">
                                                                                ${NodeLoadDataHandle.transEle.attr('data-description')}
                                                                            </label>
                                                                            <textarea
                                                                                    class="form-control"
                                                                                    rows="4" cols="50"
                                                                            ></textarea>
                                                                            <span class="form-text text-muted">Description what to do</span>
                                                                        </div>
                                                                        <br><br>
                                                                        <div class="modal-footer">
                                                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="offcanvas">${NodeLoadDataHandle.transEle.attr('data-btn-close')}</button>
                                                                            <button
                                                                                    type="button" 
                                                                                    class="btn btn-primary button-add-in-workflow-employee" 
                                                                                    data-bs-dismiss="offcanvas"
                                                                                    id=""
                                                                            >${NodeLoadDataHandle.transEle.attr('data-btn-save')}
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <table
                                                                    class="table nowrap w-100 mb-5 table-in-workflow-employee"
                                                                >
                                                                    <thead>
                                                                    <tr>
                                                                        <th class="w-20">${NodeLoadDataHandle.transEle.attr('data-collaborators')}</th>
                                                                        <th class="w-15">${NodeLoadDataHandle.transEle.attr('data-select-position')}</th>
                                                                        <th class="w-15">${NodeLoadDataHandle.transEle.attr('data-select-role')}</th>
                                                                        <th class="w-20">${NodeLoadDataHandle.transEle.attr('data-editing-zone')}</th>
                                                                        <th class="w-20">${NodeLoadDataHandle.transEle.attr('data-hidden-zone')}</th>
                                                                        <th class="w-10"></th>
                                                                    </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                        <div class="modal-footer">
                                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${NodeLoadDataHandle.transEle.attr('data-btn-close')}</button>
                                                            <button type="button" class="btn btn-primary btn-add-collab-create" data-bs-dismiss="modal">${NodeLoadDataHandle.transEle.attr('data-btn-save')}</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-4">
                                            <span class="check-done-collab" hidden><i class="fas fa-check mt-2 text-green"></i></span>
                                            <span class="check-fail-collab"><i class="fas fa-times mt-2 text-red"></i></span>
                                        </div>
                                    </div>`;
                        } else {
                            if (row?.['code'] === 'initial') {
                                return `<div class="row">
                                        <div class="col-8">
                                            <button 
                                                type="button"
                                                class="btn btn-link btn-node-collab"
                                                data-bs-toggle="modal"
                                                data-bs-target="#${idModal}"
                                            >
                                            <i class="fas fa-align-justify" data-bs-toggle="tooltip" data-bs-placement="top" title="click to add collaborator"></i>
                                            </button>
                                            <div
                                                class="modal fade" id="${idModal}" tabindex="-1" role="dialog"
                                                aria-labelledby="${idModal}" aria-hidden="true"
                                            >
                                                <div class="modal-dialog modal-dialog-centered modal-xl modal-collab" role="document">
                                                    <div class="modal-content">
                                                        <div class="modal-header">
                                                            <h5 class="modal-title">${NodeLoadDataHandle.transEle.attr('data-add-collaborators')}</h5>
                                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                                                <span aria-hidden="true">&times;</span>
                                                            </button>
                                                        </div>
                                                        <div class="modal-body modal-body-collab">
                                                            <div class="row collab-area collab-initial-area">
                                                                <table
                                                                    class="table nowrap w-100 mb-5 table-initial-node-collaborator"
                                                                >
                                                                    <thead>
                                                                    <tr>
                                                                        <th class="w-20">${NodeLoadDataHandle.transEle.attr('data-collaborators')}</th>
                                                                        <th class="w-40">${NodeLoadDataHandle.transEle.attr('data-editing-zone')}</th>
                                                                        <th class="w-40">${NodeLoadDataHandle.transEle.attr('data-hidden-zone')}</th>
                                                                    </tr>
                                                                    </thead>
                                                                    <tbody></tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                        <div class="modal-footer">
                                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${NodeLoadDataHandle.transEle.attr('data-btn-close')}</button>
                                                            <button type="button" class="btn btn-primary btn-add-collab-initital-create" data-bs-dismiss="modal">${NodeLoadDataHandle.transEle.attr('data-btn-save')}</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-4">
                                            <span class="check-done-collab"><i class="fas fa-check mt-2 text-green"></i></span>
                                            <span class="check-fail-collab" hidden><i class="fas fa-times mt-2 text-red"></i></span>
                                        </div>
                                    </div>`;
                            } else {
                                return `<div class="row">
                                        <div class="col-8">
                                            <button 
                                                type="button"
                                                class="btn btn-link btn-node-collab"
                                                data-bs-toggle="modal"
                                                data-bs-target="#${idModal}"
                                                disabled
                                            >
                                            <i class="fas fa-align-justify" data-bs-toggle="tooltip" data-bs-placement="top" title="click to add collaborator"></i>
                                            </button>
                                            <div
                                                class="modal fade" id="${idModal}" tabindex="-1" role="dialog"
                                                aria-labelledby="${idModal}" aria-hidden="true"
                                            >
                                                <div class="modal-dialog modal-dialog-centered modal-xl modal-collab" role="document">
                                                    <div class="modal-content">
                                                        <div class="modal-header">
                                                            <h5 class="modal-title">${NodeLoadDataHandle.transEle.attr('data-add-collaborators')}</h5>
                                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                                                <span aria-hidden="true">&times;</span>
                                                            </button>
                                                        </div>
                                                        <div class="modal-body modal-body-collab">
                                                            <div class="row collab-area collab-initial-area">
                                                                <table
                                                                    class="table nowrap w-100 mb-5 table-initial-node-collaborator"
                                                                >
                                                                    <thead>
                                                                    <tr>
                                                                        <th>${NodeLoadDataHandle.transEle.attr('data-collaborators')}</th>
                                                                        <th>${NodeLoadDataHandle.transEle.attr('data-select-group')}</th>
                                                                        <th>${NodeLoadDataHandle.transEle.attr('data-select-role')}</th>
                                                                        <th>${NodeLoadDataHandle.transEle.attr('data-editing-zone')}</th>
                                                                    </tr>
                                                                    </thead>
                                                                    <tbody></tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                        <div class="modal-footer">
                                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${NodeLoadDataHandle.transEle.attr('data-btn-close')}</button>
                                                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">${NodeLoadDataHandle.transEle.attr('data-btn-save')}</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-4">
                                            <span class="check-done-collab"><i class="fas fa-check mt-2 text-green"></i></span>
                                            <span class="check-fail-collab" hidden><i class="fas fa-times mt-2 text-red"></i></span>
                                        </div>
                                    </div>`;
                            }
                        }
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        if (row?.['is_system'] === true) {
                            return ``;
                        } else {
                            return `<button type="button" class="btn btn-icon btn-rounded flush-soft-hover del-row"><span class="icon"><i class="fa-regular fa-trash-can"></i></span></button>`;
                        }
                    }
                },
            ],
            drawCallback: function () {
            },
        });
    };

    static dataTableInitial($table, data) {
        $table.DataTableDefault({
            data: data ? data : [],
            ordering: false,
            paginate: false,
            info: false,
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        return `<span class="badge badge-soft-primary table-row-title" data-row="${dataRow}">${row?.['title']}</span>`;
                    }
                },
                {
                    targets: 1,
                    render: () => {
                        return `<div class="dropdown-zone">
                                    <div data-bs-spy="scroll" data-bs-smooth-scroll="true" class="h-150p position-relative overflow-y-scroll">
                                        <ul class="node-zone-list p-0"></ul>
                                    </div>
                                </div>`;
                    }
                },
                {
                    targets: 2,
                    render: () => {
                        return `<div class="dropdown-zone">
                                    <div data-bs-spy="scroll" data-bs-smooth-scroll="true" class="h-150p position-relative overflow-y-scroll">
                                        <ul class="node-zone-hidden-list p-0"></ul>
                                    </div>
                                </div>`;
                    }
                },
            ],
        });
    };

    static dataTableCollabOutFormEmployee($table, data) {
        $table.DataTableDefault({
            data: data ? data : [],
            // paginate: false,
            // info: false,
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        return `<span class="table-row-code" data-row="${dataRow}">${row?.['code']}</span>`
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<span class="table-row-title">${row?.['full_name']}</span>`;
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        if (row.hasOwnProperty('role') && Array.isArray(row?.['role'])) {
                            let result = [];
                            row?.['role'].map(item => item?.['title'] ? result.push(`<span class="badge badge-soft-primary mb-1 mr-1">` + item?.['title'] + `</span>`) : null);
                            return result.join(" ");
                        }
                        return '';
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        if (!row?.['is_checked']) {
                            return `<div class="form-check">
                                        <input 
                                            type="checkbox" 
                                            class="form-check-input table-row-checkbox-out-form"
                                            data-id="${row?.['id']}"
                                            data-title="${row?.['full_name']}"
                                        >
                                    </div>`;
                        } else {
                            return `<div class="form-check">
                                        <input 
                                            type="checkbox" 
                                            class="form-check-input table-row-checkbox-out-form"
                                            data-id="${row?.['id']}"
                                            data-title="${row?.['full_name']}"
                                            checked
                                        >
                                    </div>`;
                        }
                    }
                },
            ],
        });
    };

    static dataTableCollabInWFEmployee($table, data) {
        $table.DataTableDefault({
            data: data ? data : [],
            ordering: false,
            paginate: false,
            info: false,
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        return `<span class="table-row-title" data-row="${dataRow}">${row?.['employee']?.['full_name'] ? row?.['employee']?.['full_name'] : ''}</span>`;
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<span class="badge badge-soft-primary table-row-group">${row?.['position_choice']?.['title'] ? row?.['position_choice']?.['title'] : 'None'}</span>`;
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        if (row?.['employee'].hasOwnProperty('role') && Array.isArray(row?.['employee']?.['role'])) {
                            let result = [];
                            row?.['employee']?.['role'].map(item => item?.['title'] ? result.push(`<span class="badge badge-soft-primary mb-1 mr-1">${item?.['title']}</span>`) : null);
                            return result.join(" ");
                        }
                        return '';
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        if (row?.['is_edit_all_zone'] === true) {
                            return `<span class="badge badge-soft-success mb-1 mr-1">${NodeLoadDataHandle.transEle.attr('data-zone-all-data')}</span>`;
                        }
                        if (row.hasOwnProperty('zone') && Array.isArray(row?.['zone'])) {
                            let resultZone = ``;
                            for (let zone of row?.['zone']) {
                                if (zone?.['title']) {
                                    resultZone += `<span class="badge badge-soft-success mb-1 mr-1">${zone?.['title']}</span>`;
                                }
                            }
                            return `${resultZone}`;
                        }
                        return '';
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        if (row.hasOwnProperty('zone_hidden') && Array.isArray(row?.['zone_hidden'])) {
                            let resultZone = ``;
                            for (let zone of row?.['zone_hidden']) {
                                if (zone?.['title']) {
                                    resultZone += `<span class="badge badge-soft-warning mb-1 mr-1">${zone?.['title']}</span>`;
                                }
                            }
                            return `${resultZone}`;
                        }
                        return '';
                    }
                },
                {
                    targets: 4,
                    render: () => {
                        return `<div class="actions-btn">
                                    <button type="button" class="btn btn-icon btn-rounded btn-rounded btn-flush-light flush-soft-hover edit-row-in-wf-emp" hidden><span class="icon"><i class="far fa-edit"></i></span></button>
                                    <button type="button" class="btn btn-icon btn-rounded btn-rounded btn-flush-light flush-soft-hover del-row-in-wf-emp"><span class="icon"><i class="fa-regular fa-trash-can"></i></span></button>
                                </div>`
                    }
                },
            ],
        });
    };

}

// Submit Form
class NodeSubmitHandle {

    static setupDataSubmit(is_flowchart = false) {
        let result = []
        let table = NodeDataTableHandle.tableNode;
        let field_list = [
            'title',
            'code',
            'remark',
            'actions',
            'option_collaborator',
            'zone_initial_node',
            'zone_hidden_initial_node',
            'order',
            'is_system',
            'code_node_system',
            'condition',
            'collab_in_form',
            'collab_out_form',
            'collab_in_workflow',
            'coordinates',
            'is_edit_all_zone',
        ];
        for (let i = 0; i < table[0].tBodies[0].rows.length; i++) {
            let total_in_runtime = 1;
            let total_config = 1;
            let row = table[0].tBodies[0].rows[i];
            let eleTitle = row?.querySelector('.table-row-title');
            if (eleTitle) {
                let dataRowRaw = eleTitle.getAttribute('data-row');
                if (dataRowRaw) {
                    let dataRow = JSON.parse(dataRowRaw);
                    // setup data actions on Node
                    let actions = [];
                    for (let eleChecked of row.querySelectorAll('.check-action-node:checked')) {
                        actions.push(parseInt($(eleChecked).attr('data-id')));
                    }
                    dataRow['actions'] = actions;
                    let modalCollab = row.querySelector('.modal-collab');
                    if (dataRow?.['is_system'] === true) { // SYSTEM NODES
                        if (dataRow?.['code'] === 'initial') {
                            let initialArea = modalCollab.querySelector('.collab-initial-area');
                            // check data actions
                            if (dataRow['actions'].length <= 0) {
                                $.fn.notifyB({description: NodeLoadDataHandle.transEle.attr('data-complete-node')}, 'failure');
                                return false
                            }
                            let zoneAllData = initialArea.querySelector('.checkbox-node-zone-all');
                            if (zoneAllData) {
                                if (zoneAllData.checked === true) {
                                    dataRow['is_edit_all_zone'] = true;
                                    dataRow['zone_initial_node'] = [];
                                } else {
                                    dataRow['is_edit_all_zone'] = false;
                                    let zone_initial_node = [];
                                    for (let eleChecked of initialArea.querySelectorAll('.checkbox-node-zone:checked')) {
                                        zone_initial_node.push(parseInt($(eleChecked).attr('data-id')));
                                    }
                                    dataRow['zone_initial_node'] = zone_initial_node;
                                }
                            }
                            let zone_hidden_initial_node = [];
                            for (let eleChecked of initialArea.querySelectorAll('.checkbox-node-zone-hidden:checked')) {
                                zone_hidden_initial_node.push(parseInt($(eleChecked).attr('data-id')));
                            }
                            dataRow['zone_hidden_initial_node'] = zone_hidden_initial_node;
                        } else if (dataRow?.['code'] === 'approved') {
                            dataRow['order'] = (table[0].tBodies[0].rows.length - 1);
                        } else if (dataRow?.['code'] === 'completed') {
                            dataRow['order'] = table[0].tBodies[0].rows.length;
                        }
                    } else { // COLLAB NODES
                        // setup title & remark node collab
                        if (eleTitle.value) {
                            dataRow['title'] = eleTitle.value;
                        } else {
                            $.fn.notifyB({description: NodeLoadDataHandle.transEle.attr('data-complete-node')}, 'failure');
                            return false
                        }
                        let eleRemark = row?.querySelector('.table-row-remark');
                        if (eleRemark) {
                            dataRow['remark'] = eleRemark.value;
                        }
                        // check data actions
                        if (dataRow['actions'].length <= 0) {
                            $.fn.notifyB({description: NodeLoadDataHandle.transEle.attr('data-complete-node')}, 'failure');
                            return false
                        }
                        // reset data collab_in_form, collab_out_form, collab_in_workflow when update
                        dataRow['collab_in_form'] = {};
                        dataRow['collab_out_form'] = {};
                        dataRow['collab_in_workflow'] = [];
                        // setup data collab depend on option_collaborator
                        let boxListSource = modalCollab.querySelector('.box-list-source');
                        if ($(boxListSource).val() === '1') { // In Form
                            dataRow['option_collaborator'] = 0;
                            let dataInForm = {};
                            let IFArea = modalCollab.querySelector('.collab-in-form-area');
                            if ($(IFArea?.querySelector('.box-in-form-property')).val()) {
                                dataInForm['app_property'] = $(IFArea?.querySelector('.box-in-form-property')).val();
                            } else {
                                $.fn.notifyB({description: NodeLoadDataHandle.transEle.attr('data-complete-node')}, 'failure');
                                return false
                            }
                            let zoneAllData = IFArea.querySelector('.checkbox-node-zone-all');
                            if (zoneAllData) {
                                if (zoneAllData.checked === true) {
                                    dataInForm['is_edit_all_zone'] = true;
                                    dataInForm['zone'] = [];
                                } else {
                                    dataInForm['is_edit_all_zone'] = false;
                                    if ($(IFArea?.querySelector('.node-zone-submit')).val()) {
                                        dataInForm['zone'] = JSON.parse($(IFArea?.querySelector('.node-zone-submit')).val());
                                    }
                                }
                            }
                            if ($(IFArea?.querySelector('.node-zone-hidden-submit')).val()) {
                                dataInForm['zone_hidden'] = JSON.parse($(IFArea?.querySelector('.node-zone-hidden-submit')).val());
                            }
                            dataRow['collab_in_form'] = dataInForm;
                        } else if ($(boxListSource).val() === '2') { // Out Form
                            dataRow['option_collaborator'] = 1;
                            let dataOutForm = {};
                            let OFArea = modalCollab.querySelector('.collab-out-form-area');
                            if ($(OFArea?.querySelector('.node-out-form-employee-submit')).val()) {
                                dataOutForm['employee_list'] = JSON.parse($(OFArea?.querySelector('.node-out-form-employee-submit')).val());
                            } else {
                                $.fn.notifyB({description: NodeLoadDataHandle.transEle.attr('data-complete-node')}, 'failure');
                                return false
                            }
                            let zoneAllData = OFArea.querySelector('.checkbox-node-zone-all');
                            if (zoneAllData) {
                                if (zoneAllData.checked === true) {
                                    dataOutForm['is_edit_all_zone'] = true;
                                    dataOutForm['zone'] = [];
                                } else {
                                    dataOutForm['is_edit_all_zone'] = false;
                                    if ($(OFArea?.querySelector('.node-zone-submit')).val()) {
                                        dataOutForm['zone'] = JSON.parse($(OFArea?.querySelector('.node-zone-submit')).val());
                                    }
                                }
                            }
                            if ($(OFArea?.querySelector('.node-zone-hidden-submit')).val()) {
                                dataOutForm['zone_hidden'] = JSON.parse($(OFArea?.querySelector('.node-zone-hidden-submit')).val());
                            }
                            dataRow['collab_out_form'] = dataOutForm;
                            if (is_flowchart === true) {
                                total_config = dataOutForm?.['employee_list'].length;
                            }
                        } else if ($(boxListSource).val() === '3') { // In Workflow
                            dataRow['option_collaborator'] = 2;
                            let dataInWF = [];
                            let InWFArea = modalCollab?.querySelector('.collab-in-workflow-area');
                            let tableInWF = InWFArea?.querySelector('.table-in-workflow-employee');
                            $(tableInWF).DataTable().rows().every(function () {
                                let rowInWF = this.node();
                                let dataRowInWFRaw = rowInWF?.querySelector('.table-row-title').getAttribute('data-row');
                                if (dataRowInWFRaw) {
                                    let dataRowInWF = JSON.parse(dataRowInWFRaw);
                                    let zone = [];
                                    let zone_hidden = [];
                                    let is_edit_all_zone = false;
                                    if (dataRowInWF?.['is_edit_all_zone'] === true) {
                                        is_edit_all_zone = true;
                                    } else {
                                        for (let zoneData of dataRowInWF?.['zone']) {  // In WF employee has different zones => need to for every row to get zones
                                            zone.push(parseInt(zoneData?.['id']));
                                        }
                                    }
                                    for (let zoneData of dataRowInWF?.['zone_hidden']) {  // In WF employee has different zones => need to for every row to get zones
                                        zone_hidden.push(parseInt(zoneData?.['id']));
                                    }
                                    if (dataRowInWF?.['in_wf_option']) {
                                        if (dataRowInWF?.['employee']?.['id'] || dataRowInWF?.['position_choice']?.['id']) {
                                            dataInWF.push({
                                                'in_wf_option': dataRowInWF?.['in_wf_option'],
                                                'employee': dataRowInWF?.['employee']?.['id'] ? dataRowInWF?.['employee']?.['id'] : null,
                                                'position_choice': dataRowInWF?.['position_choice']?.['id'] ? dataRowInWF?.['position_choice']?.['id'] : null,
                                                'zone': zone,
                                                'zone_hidden': zone_hidden,
                                                'is_edit_all_zone': is_edit_all_zone,
                                            })
                                        } else {
                                            $.fn.notifyB({description: NodeLoadDataHandle.transEle.attr('data-complete-node')}, 'failure');
                                            return false
                                        }
                                    }
                                }
                            });
                            dataRow['collab_in_workflow'] = dataInWF;
                            if (is_flowchart === true) {
                                total_in_runtime = dataInWF.length;
                                total_config = dataInWF.length;
                            }
                        }
                    }
                    filterFieldList(field_list, dataRow);
                    if (is_flowchart === true) {
                        dataRow['collaborators'] = {
                            'option': dataRow?.['option_collaborator'],
                            'total_in_runtime': total_in_runtime,
                            'total_config': total_config,
                        }
                    }
                    result.push(dataRow);
                }
            }
        }
        return result;
    };
}

// Validate
class NodeValidateHandle {
    static zoneHiddenEmployee = {};

    static validateZoneEdit(ele) {
        let zoneID = ele.getAttribute('data-id');
        if (zoneID) {
            let collabArea = ele.closest('.collab-area');
            let checkboxNodeZoneHiddenChecked = collabArea.querySelector(`.checkbox-node-zone-hidden[data-id="${zoneID}"]:checked`);
            if (checkboxNodeZoneHiddenChecked) {
                ele.checked = false;
                $.fn.notifyB({description: NodeLoadDataHandle.transEle.attr('data-valid-zone-edit')}, 'failure');
                return false;
            }
        }
        return true;
    };

    static validateZoneEditAll(ele) {
        let collabArea = ele.closest('.collab-area');
        let checkboxNodeZoneHiddenCheckedList = collabArea.querySelectorAll(`.checkbox-node-zone-hidden:checked`);
        if (checkboxNodeZoneHiddenCheckedList.length > 0) {
            ele.checked = false;
            $.fn.notifyB({description: NodeLoadDataHandle.transEle.attr('data-valid-zone-hidden-exist')}, 'failure');
            return false;
        }
        return true;
    };

    static validateZoneHidden(ele) {
        let collabArea = ele.closest('.collab-area');
        let zoneAllDataChecked = collabArea.querySelector('.checkbox-node-zone-all:checked');
        if (zoneAllDataChecked) {
            ele.checked = false;
            $.fn.notifyB({description: NodeLoadDataHandle.transEle.attr('data-valid-zone-edit-all')}, 'failure');
            return false;
        }
        let zoneID = ele.getAttribute('data-id');
        if (zoneID) {
            let checkboxNodeZoneEditChecked = collabArea.querySelector(`.checkbox-node-zone[data-id="${zoneID}"]:checked`);
            if (checkboxNodeZoneEditChecked) {
                ele.checked = false;
                $.fn.notifyB({description: NodeLoadDataHandle.transEle.attr('data-valid-zone-hidden')}, 'failure');
                return false;
            }
        }
        return true;
    };

    static validateZoneHiddenAll(ele) {
        let collabArea = ele.closest('.collab-area');
        let checkboxNodeZoneEditAll = collabArea.querySelector(`.checkbox-node-zone-all:checked`);
        if (checkboxNodeZoneEditAll) {
            ele.checked = false;
            $.fn.notifyB({description: NodeLoadDataHandle.transEle.attr('data-valid-zone-hidden-all')}, 'failure');
            return false
        }
        return true;
    };

    static validateZoneHiddenEmployeeSetup(employeeID, zoneHiddenList) {
        if (!NodeValidateHandle.zoneHiddenEmployee.hasOwnProperty(employeeID)) {
            NodeValidateHandle.zoneHiddenEmployee[employeeID] = zoneHiddenList;
        } else {
            NodeValidateHandle.zoneHiddenEmployee[employeeID] = NodeValidateHandle.zoneHiddenEmployee[employeeID].concat(zoneHiddenList);
        }
    };

    static validateZoneHiddenEmployee(ele) {
        let zoneID = ele.getAttribute('data-id');
        if (zoneID) {
            let collabArea = ele.closest('.collab-area');
            if (collabArea.classList.contains('collab-in-workflow-area')) {
                let eleBoxEmployee = collabArea.querySelector('.box-in-workflow-employee');
                if ($(eleBoxEmployee).val()) {
                    let dataEmployee = SelectDDControl.get_data_from_idx($(eleBoxEmployee), $(eleBoxEmployee).val());
                    if (NodeValidateHandle.zoneHiddenEmployee.hasOwnProperty(dataEmployee?.['id'])) {
                        if (NodeValidateHandle.zoneHiddenEmployee[dataEmployee?.['id']].includes(zoneID)) {

                        }
                    }
                }
            }
        }
    };

}

// COMMON FUNCTION
function filterFieldList(field_list, data_json) {
    for (let key in data_json) {
        if (!field_list.includes(key)) delete data_json[key]
    }
    return data_json;
}

function deleteWFNodeRowTable(currentRow, $table) {
    // Get the index of the current row within the DataTable
    let rowIndex = $table.DataTable().row(currentRow).index();
    let row = $table.DataTable().row(rowIndex);
    // Delete current row
    row.remove().draw();
}
