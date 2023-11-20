// LoadData
class NodeLoadDataHandle {
    static btnAddNode = $('#btn-add-new-node-create');
    static nodeModalTitleEle = $('#modal-node-name-create');
    static nodeModalDescriptionEle = $('#modal-node-description-create');
    static transEle = $('#node-trans-factory');
    static dataSystemNode = [
        {
            'id': 'abccf657-7dce-4a14-9601-f6c4c4f2722a',
            'title': 'Initial Node',
            'code': 'initial',
            'code_node_system': 'initial',
            'is_system': true,
            'order': 1,
            'workflow': null,
        },
        {
            'id': '1fbb680e-3521-424a-8523-9f7a34ce867e',
            'title': 'Approved Node',
            'code': 'approved',
            'code_node_system': 'approved',
            'is_system': true,
            'order': 2,
            'workflow': null,
        },
        {
            'id': '580f887c-1280-44ea-b275-8cb916543b10',
            'title': 'Completed Node',
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
    static dataInWFOption = [
        {'id': 2, 'title': 'Employee'},
        {'id': 1, 'title': 'Position title'},
        {'id': 0, 'title': ''},
    ];
    static dataPosition = [
        {'id': 3, 'title': 'Beneficiary'},
        {'id': 2, 'title': '2nd manager'},
        {'id': 1, 'title': '1st manager'},
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
            callbackTextDisplay: function (item) {
                return item?.['full_name'] || '';
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
        let approvedRow = NodeDataTableHandle.tableNode[0].querySelector('.node-approved').closest('tr');
        $(newRow).detach().insertBefore(approvedRow);
        // Load zone DD
        NodeLoadDataHandle.loadZoneDD(newRow, true);
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
            'title': 'Document creator',
            'group': {},
            'role': [],
        }
        $(tableInitial).DataTable().row.add(dataInitial).draw().node();
        return true;
    };

    static loadZoneDD(row, is_created = false) {
        let result = ``;
        if (is_created === false) { // Case Update Exist Nodes
            let eleCheckBox = row?.querySelector('.table-row-checkbox');
            if (eleCheckBox) {
                let dataRowRaw = eleCheckBox.getAttribute('data-row');
                if (dataRowRaw) {
                    let dataRow = JSON.parse(dataRowRaw);
                    if (dataRow?.['is_system'] === true) { // SYSTEM NODES
                        if (dataRow?.['code'] === 'initial') {
                            result += `<div class="d-flex align-items-center justify-content-between mb-3">
                                            <div class="node-zone-title">All</div>
                                            <input type="checkbox" class="form-check-input checkbox-node-zone-all" checked>
                                        </div>`;
                            let table = document.getElementById('table_workflow_zone');
                            if (!table.querySelector('.dataTables_empty')) {
                                for (let i = 0; i < table.tBodies[0].rows.length; i++) {
                                    let row = table.tBodies[0].rows[i];
                                    let title = row.children[1].children[0].innerHTML;
                                    result += `<li class="d-flex align-items-center justify-content-between mb-3">
                                                    <div class="media d-flex align-items-center">
                                                        <div class="media-body">
                                                            <div>
                                                                <div class="node-zone-title">${title}</div>
                                                            </div>
                                                        </div>  
                                                    </div>
                                                    <div class="form-check form-check-theme ms-3">
                                                        <input type="checkbox" class="form-check-input checkbox-node-zone" data-id="${i + 1}" data-title="${title}" checked>
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
                    } else { // COLLAB NODES
                        let zone_list = [];
                        for (let eleChecked of row?.querySelectorAll('.checkbox-node-zone:checked')) {
                            zone_list.push(parseInt($(eleChecked).attr('data-id')));
                        }
                        result += `<li class="d-flex align-items-center justify-content-between mb-3">
                                    <div class="media d-flex align-items-center">
                                        <div class="media-body">
                                            <div>
                                                <div class="node-zone-title">All</div>
                                            </div>
                                        </div>  
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
                                if (zone_list.includes(i + 1)) {
                                    result += `<li class="d-flex align-items-center justify-content-between mb-3">
                                                <div class="media d-flex align-items-center">
                                                    <div class="media-body">
                                                        <div>
                                                            <div class="node-zone-title">${title}</div>
                                                        </div>
                                                    </div>  
                                                </div>
                                                <div class="form-check form-check-theme ms-3">
                                                    <input type="checkbox" class="form-check-input checkbox-node-zone" data-id="${i + 1}" data-title="${title}" checked>
                                                </div>
                                            </li>`;
                                } else {
                                    result += `<li class="d-flex align-items-center justify-content-between mb-3">
                                                <div class="media d-flex align-items-center">
                                                    <div class="media-body">
                                                        <div>
                                                            <div class="node-zone-title">${title}</div>
                                                        </div>
                                                    </div>  
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
            }
        } else { // Case Create New Node
            result += `<li class="d-flex align-items-center justify-content-between mb-3">
                                <div class="media d-flex align-items-center">
                                    <div class="media-body">
                                        <div>
                                            <div class="node-zone-title">All</div>
                                        </div>
                                    </div>
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
                                <div class="media d-flex align-items-center">
                                    <div class="media-body">
                                        <div>
                                            <div class="node-zone-title">${title}</div>
                                        </div>
                                    </div>
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

    static loadZoneDDAllTable() {
        for (let i = 0; i < NodeDataTableHandle.tableNode[0].tBodies[0].rows.length; i++) {
            let row = NodeDataTableHandle.tableNode[0].tBodies[0].rows[i];
            NodeLoadDataHandle.loadZoneDD(row);
        }
    };

    static loadZoneShow(ele) {
        let zone_list = [];
        let zone_json_list = [];
        let eleZoneSubmit = ele?.closest('.input-group-zone')?.querySelector('.node-zone-submit');
        let eleZoneJSonSubmit = ele?.closest('.input-group-zone')?.querySelector('.node-zone-json-submit');
        let eleZoneDD = ele?.closest('.dropdown-zone');
        let eleZoneShow = ele?.closest('.input-group-zone')?.querySelector('.node-zone-show');
        $(eleZoneShow).empty();
        for (let eleChecked of eleZoneDD?.querySelectorAll('.checkbox-node-zone:checked')) {
            $(eleZoneShow).append(`<span class="badge badge-soft-primary mr-1">${$(eleChecked).attr('data-title')}</span>`);
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
            row.querySelector('.collab-in-form-area').removeAttribute('hidden')
        } else if ($(ele).val() === '2') {
            row.querySelector('.collab-out-form-area').removeAttribute('hidden')
        } else if ($(ele).val() === '3') {
            row.querySelector('.collab-in-workflow-area').removeAttribute('hidden')
        }
    };

    static loadOutFormEmployeeShow(ele) {
        let emp_list = [];
        let eleOFESubmit = ele.closest('.collab-out-form-area').querySelector('.node-out-form-employee-submit');
        let table = ele.closest('.collab-out-form-area').querySelector('.table-out-form-employee');
        let eleEmpShow = ele.closest('.collab-out-form-area').querySelector('.node-out-form-employee-show');
        $(eleEmpShow).empty();
        for (let eleChecked of table.querySelectorAll('.table-row-checkbox-out-form:checked')) {
            $(eleEmpShow).append(`<span class="badge badge-soft-primary mr-1">${$(eleChecked).attr('data-title')}</span>`);
            emp_list.push($(eleChecked).attr('data-id'));
        }
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
        if ($(eleBoxOption).val()) {
            let dataSelected = SelectDDControl.get_data_from_idx($(eleBoxOption), $(eleBoxOption).val());
            if (dataSelected?.['id'] === 1) {
                let eleBoxPosition = ele.closest('.collab-in-workflow-area').querySelector('.box-in-workflow-position');
                if ($(eleBoxPosition).val()) {
                    let dataPosition = SelectDDControl.get_data_from_idx($(eleBoxPosition), $(eleBoxPosition).val());
                    let zone = [];
                    if ($(eleZoneJSonSubmit).val()) {
                        zone = JSON.parse($(eleZoneJSonSubmit).val());
                    }
                    let data = {
                        'in_wf_option': 1,
                        'position_choice': dataPosition,
                        'employee': {},
                        'zone': zone
                    }
                    $(table).DataTable().row.add(data).draw().node();
                }
            }
            if (dataSelected?.['id'] === 2) {
                let eleBoxEmployee = ele.closest('.collab-in-workflow-area').querySelector('.box-in-workflow-employee');
                if ($(eleBoxEmployee).val()) {
                    let dataEmployee = SelectDDControl.get_data_from_idx($(eleBoxEmployee), $(eleBoxEmployee).val());
                    let zone = [];
                    if ($(eleZoneJSonSubmit).val()) {
                        zone = JSON.parse($(eleZoneJSonSubmit).val());
                    }
                    let data = {
                        'in_wf_option': 2,
                        'position_choice': {},
                        'employee': dataEmployee,
                        'zone': zone
                    }
                    $(table).DataTable().row.add(data).draw().node();
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
            let dataRowRaw = row?.querySelector('.table-row-checkbox')?.getAttribute('data-row');
            if (dataRowRaw) {
                let dataRow = JSON.parse(dataRowRaw);
                NodeLoadDataHandle.loadZoneDD(row);
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
        let dataSource = {
            2: {'id': 3, 'title': 'In workflow'},
            1: {'id': 2, 'title': 'Out form'},
            0: {'id': 1, 'title': 'In form'},
        };
        if (dataRow?.['is_system'] === true) { // SYSTEM NODES
            if (dataRow?.['code'] === 'initial') {
                let zone_initial_node = [];
                for (let zone of dataRow?.['zone_initial_node']) {
                    zone_initial_node.push(zone?.['order']);
                }
                let tableInitial = modalCollab.querySelector('.table-initial-node-collaborator');
                NodeDataTableHandle.dataTableInitial($(tableInitial));
                NodeLoadDataHandle.loadRowTableInitialNode(row);
                for (let t = 0; t < tableInitial.tBodies[0].rows.length; t++) {
                    let rowInit = tableInitial.tBodies[0].rows[t];
                    NodeLoadDataHandle.loadZoneDD(rowInit);
                    for (let eleCheck of rowInit.querySelectorAll('.checkbox-node-zone')) {
                        if (zone_initial_node.includes(parseInt($(eleCheck).attr('data-id')))) {
                            eleCheck.checked = true;
                        }
                    }
                }
            }
        } else { // COLLAB NODES
            NodeLoadDataHandle.loadInitDataRow(row);
            let boxListSource = modalCollab.querySelector('.box-list-source');
            $(boxListSource).empty();
            NodeLoadDataHandle.loadBoxListSource($(boxListSource), dataSource[dataRow?.['option_collaborator']]);
            NodeLoadDataHandle.loadAreaByListSource(boxListSource);
            NodeLoadDataHandle.loadBoxListSource($(boxListSource));
            if (dataRow?.['option_collaborator'] === 0) { // In Form
                let dataIF = dataRow?.['collab_in_form'];
                let IFArea = modalCollab.querySelector('.collab-in-form-area');
                let boxProp = IFArea?.querySelector('.box-in-form-property');
                let eleZoneSubmit = IFArea?.querySelector('.node-zone-submit');
                let eleZoneJSonSubmit = IFArea?.querySelector('.node-zone-json-submit');
                let eleZoneDD = IFArea?.querySelector('.dropdown-zone');
                $(boxProp).empty();
                NodeLoadDataHandle.loadBoxPropertyEmployee($(boxProp), dataIF?.['app_property']);
                // zone
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
            } else if (dataRow?.['option_collaborator'] === 1) { // Out Form
                let dataOF = dataRow['collab_out_form'];
                let OFArea = modalCollab.querySelector('.collab-out-form-area');
                let eleZoneSubmit = OFArea?.querySelector('.node-zone-submit');
                let eleZoneJSonSubmit = OFArea?.querySelector('.node-zone-json-submit');
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
                                    NodeDataTableHandle.dataTableCollabOutFormEmployee($(tableOutFormEmployee));
                                    for (let item of data.employee_list) {
                                        if (employee_id_list.includes(item?.['id'])) {
                                            item['is_checked'] = true;
                                        }
                                    }
                                    $(tableOutFormEmployee).DataTable().rows.add(data.employee_list).draw();
                                    let btnAddEmpOF = OFArea?.querySelector('.button-add-out-form-employee');
                                    NodeLoadDataHandle.loadOutFormEmployeeShow(btnAddEmpOF);
                                }
                            }
                        }
                    )
                }
                // zone
                if (eleZoneJSonSubmit) {
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
            } else if (dataRow?.['option_collaborator'] === 2) { // In Workflow
                let dataInWF = dataRow?.['collab_in_workflow'];
                let InWFArea = modalCollab?.querySelector('.collab-in-workflow-area');
                let tableInWF = InWFArea?.querySelector('.table-in-workflow-employee');
                let dataPosition = {
                    1: {'id': 1, 'title': '1st manager'},
                    2: {'id': 2, 'title': '2nd manager'},
                }
                for (let inWF of dataInWF) {
                    if (inWF?.['position_choice']) {
                        inWF['position_choice'] = dataPosition[inWF['position_choice']];
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
                        let attrClass = "form-check-input table-row-checkbox"
                        if (row?.['is_system'] === true) {
                            attrClass += " node-";
                            attrClass += row?.['code'];
                        }
                        return `<div class="form-check">
                                    <input 
                                        type="checkbox" 
                                        class="${attrClass}" 
                                        data-id=""
                                        data-row="${dataRow}"
                                    >
                                </div>`;
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<span class="table-row-title">${row?.['title']}</span>`
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<span class="table-row-remark">${row?.['remark'] ? row?.['remark'] : ''}</span>`;
                    }
                },
                {
                    targets: 3,
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
                    targets: 4,
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
                                                            <h5 class="modal-title">Add Collaborators</h5>
                                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                                                <span aria-hidden="true">&times;</span>
                                                            </button>
                                                        </div>
                                                        <div class="modal-body modal-body-collab">
                                                            <div class="row collab-common-area">
                                                                <div class="form-group">
                                                                    <label class="form-label required">List source</label>
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
                                                            <div class="row collab-area collab-in-form-area">
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
                                                                <div class="form-group">
                                                                    <label class="form-label">Editing zone</label>
                                                                    <div class="input-group input-group-zone mb-3">
                                                                        <span class="input-affix-wrapper">
                                                                            <div class="form-control div-input node-zone-show"></div>
                                                                            <input type="hidden" class="node-zone-submit">
                                                                            <input type="hidden" class="node-zone-json-submit">
                                                                            <span class="input-suffix">
                                                                                <div class="btn-group btn-link dropdown dropdown-zone">
                                                                                    <i class="fas fa-align-justify" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
                                                                                    <div class="dropdown-menu w-250p">
                                                                                        <div class="h-250p">
                                                                                            <div data-simplebar class="nicescroll-bar">
                                                                                                <ul class="node-zone-list p-0"></ul>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                        </span>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="row collab-area collab-out-form-area" hidden>
                                                                <div class="form-group">
                                                                    <label class="form-label">Employee list</label>
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
                                                                                    <th>${NodeLoadDataHandle.transEle.attr('data-role')}</th>
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
                                                                                        id=""
                                                                                >${NodeLoadDataHandle.transEle.attr('data-btn-save')}
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="form-group">
                                                                    <label class="form-label">Editing zone</label>
                                                                    <div class="input-group input-group-zone mb-3">
                                                                        <span class="input-affix-wrapper">
                                                                            <div class="form-control div-input node-zone-show"></div>
                                                                            <input type="hidden" class="node-zone-submit">
                                                                            <input type="hidden" class="node-zone-json-submit">
                                                                            <span class="input-suffix">
                                                                                <div class="btn-group btn-link dropdown dropdown-zone">
                                                                                    <i class="fas fa-align-justify" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
                                                                                    <div class="dropdown-menu w-250p">
                                                                                        <div class="h-250p">
                                                                                            <div data-simplebar class="nicescroll-bar">
                                                                                                <ul class="node-zone-list p-0"></ul>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                        </span>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="row collab-area collab-in-workflow-area" hidden>
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
                                                                            <label class="form-label">Select position</label>
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
                                                                            >
                                                                            </select>
                                                                        </div>
                                                                        <div class="form-group">
                                                                            <label class="form-label">Editing zone</label>
                                                                            <div class="input-group input-group-zone mb-3">
                                                                                <span class="input-affix-wrapper">
                                                                                    <div class="form-control div-input node-zone-show"></div>
                                                                                    <input type="hidden" class="node-zone-submit">
                                                                                    <input type="hidden" class="node-zone-json-submit">
                                                                                    <span class="input-suffix">
                                                                                        <div class="btn-group btn-link dropdown dropdown-zone">
                                                                                            <i class="fas fa-align-justify" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
                                                                                            <div class="dropdown-menu w-250p">
                                                                                                <div class="h-250p">
                                                                                                    <div data-simplebar class="nicescroll-bar">
                                                                                                        <ul class="node-zone-list p-0"></ul>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                </span>
                                                                                </span>
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
                                                            <h5 class="modal-title">Add Collaborators</h5>
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
                                                                        <th class="w-20">Collaborator</th>
<!--                                                                        <th>Group</th>-->
<!--                                                                        <th>Role</th>-->
                                                                        <th class="w-80">Editing Zone</th>
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
                                                            <h5 class="modal-title">Add Collaborators</h5>
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
                                                                        <th>Collaborator</th>
                                                                        <th>Group</th>
                                                                        <th>Role</th>
                                                                        <th>Editing Zone</th>
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
                    targets: 5,
                    render: () => {
                        let bt2 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Edit" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit" style="color: #cccccc"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></span></span></a>`;
                        let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2" style="color: #cccccc"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></span></span></a>`;
                        let actionData = bt2 + bt3;
                        return `${actionData}`;
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
                // {
                //     targets: 1,
                //     render: (data, type, row) => {
                //         return `<span class="badge badge-soft-primary table-row-group">${row?.['group']?.['title']}</span>`;
                //     }
                // },
                // {
                //     targets: 2,
                //     render: (data, type, row) => {
                //         if (row.hasOwnProperty('role') && Array.isArray(row?.['role'])) {
                //             let result = [];
                //             row?.['role'].map(item => item?.['title'] ? result.push(`<span class="badge badge-soft-primary mb-1 mr-1">` + item?.['title'] + `</span>`) : null);
                //             return result.join(" ");
                //         }
                //         return '';
                //     }
                // },
                {
                    targets: 1,
                    render: () => {
                        // return `<div class="dropdown dropdown-zone">
                        //             <button aria-expanded="false" data-bs-toggle="dropdown" class="btn btn-primary dropdown-toggle" type="button">zone</button>
                        //             <div class="dropdown-menu dropdown-menu-up w-250p">
                        //                 <div class="h-250p">
                        //                     <div data-simplebar class="nicescroll-bar">
                        //                         <ul class="node-zone-list p-0"></ul>
                        //                     </div>
                        //                 </div>
                        //             </div>
                        //         </div>`
                        return `<div class="dropdown-zone">
                                    <div data-bs-spy="scroll" data-bs-smooth-scroll="true" class="h-150p position-relative overflow-y-scroll">
                                        <ul class="node-zone-list p-0"></ul>
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
            paginate: false,
            info: false,
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
                        if (row.hasOwnProperty('zone') && Array.isArray(row?.['zone'])) {
                            let result = [];
                            row?.['zone'].map(item => item?.['title'] ? result.push(`<span class="badge badge-soft-primary mb-1 mr-1">${item?.['title']}</span>`) : null);
                            return result.join(" ");
                        }
                        return '';
                    }
                },
                {
                    targets: 4,
                    render: () => {
                        return `<button type="button" class="btn btn-icon btn-rounded flush-soft-hover del-row"><span class="icon"><i class="fa-regular fa-trash-can"></i></span></button>`;
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
            'order',
            'is_system',
            'code_node_system',
            'condition',
            'collab_in_form',
            'collab_out_form',
            'collab_in_workflow',
            'coordinates',
        ];
        for (let i = 0; i < table[0].tBodies[0].rows.length; i++) {
            let total_in_runtime = 1;
            let total_config = 1;
            let row = table[0].tBodies[0].rows[i];
            let eleTitle = row?.querySelector('.table-row-title');
            let eleCheckBox = row?.querySelector('.table-row-checkbox');
            if (eleTitle && eleCheckBox) {
                let dataRowRaw = eleCheckBox.getAttribute('data-row');
                if (dataRowRaw) {
                    let dataRow = JSON.parse(dataRowRaw);
                    let actions = [];
                    for (let eleChecked of row.querySelectorAll('.check-action-node:checked')) {
                        actions.push(parseInt($(eleChecked).attr('data-id')));
                    }
                    dataRow['actions'] = actions;
                    let modalCollab = row.querySelector('.modal-collab');
                    if (dataRow?.['is_system'] === true) { // SYSTEM NODES
                        if (dataRow?.['code'] === 'initial') {
                            let tableInitial = modalCollab.querySelector('.table-initial-node-collaborator');
                            if (!tableInitial.querySelector('.dataTables_empty')) {
                                for (let t = 0; t < tableInitial.tBodies[0].rows.length; t++) {
                                    let rowInit = tableInitial.tBodies[0].rows[t];
                                    let zone_initial_node = [];
                                    for (let eleChecked of rowInit.querySelectorAll('.checkbox-node-zone:checked')) {
                                        zone_initial_node.push(parseInt($(eleChecked).attr('data-id')));
                                    }
                                    dataRow['zone_initial_node'] = zone_initial_node;
                                }
                            }
                        } else if (dataRow?.['code'] === 'approved') {
                            dataRow['order'] = (table[0].tBodies[0].rows.length - 1);
                        } else if (dataRow?.['code'] === 'completed') {
                            dataRow['order'] = table[0].tBodies[0].rows.length;
                        }
                    } else { // COLLAB NODES
                        let boxListSource = modalCollab.querySelector('.box-list-source');
                        if ($(boxListSource).val() === '1') { // In Form
                            dataRow['option_collaborator'] = 0;
                            let dataInForm = {};
                            let IFArea = modalCollab.querySelector('.collab-in-form-area');
                            dataInForm['app_property'] = $(IFArea?.querySelector('.box-in-form-property')).val();
                            if ($(IFArea?.querySelector('.node-zone-submit')).val()) {
                                dataInForm['zone'] = JSON.parse($(IFArea?.querySelector('.node-zone-submit')).val());
                            }
                            dataRow['collab_in_form'] = dataInForm;
                        } else if ($(boxListSource).val() === '2') { // Out Form
                            dataRow['option_collaborator'] = 1;
                            let dataOutForm = {};
                            let OFArea = modalCollab.querySelector('.collab-out-form-area');
                            dataOutForm['employee_list'] = JSON.parse($(OFArea?.querySelector('.node-out-form-employee-submit')).val());
                            if ($(OFArea?.querySelector('.node-zone-submit')).val()) {
                                dataOutForm['zone'] = JSON.parse($(OFArea?.querySelector('.node-zone-submit')).val());
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
                                    for (let zoneData of dataRowInWF?.['zone']) {
                                        zone.push(parseInt(zoneData?.['id']));
                                    }
                                    if (dataRowInWF?.['in_wf_option']) {
                                        dataInWF.push({
                                            'in_wf_option': dataRowInWF?.['in_wf_option'],
                                            'employee': dataRowInWF?.['employee']?.['id'] ? dataRowInWF?.['employee']?.['id'] : null,
                                            'position_choice': dataRowInWF?.['position_choice']?.['id'] ? dataRowInWF?.['position_choice']?.['id'] : null,
                                            'zone': zone,
                                        })
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

// COMMON FUNCTION
function filterFieldList(field_list, data_json) {
    for (let key in data_json) {
        if (!field_list.includes(key)) delete data_json[key]
    }
    return data_json;
}
