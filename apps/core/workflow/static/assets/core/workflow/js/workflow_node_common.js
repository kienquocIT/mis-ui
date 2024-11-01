// LoadData
class NodeLoadDataHandle {
    static $form = $('#form-create_workflow');

    static $initEmp = $('#data-init-employee');
    static $btnNewNode = $('#btn-new-node');
    static $btnSaveNode = $('#btn-save-node');
    static $modalNode = $('#nodeModal');
    static $nodeSysArea = $('#node-system-area');
    static $nodeCusArea = $('#node-custom-area');
    static $titleNode = $('#node-title');
    static $remarkNode = $('#node-remark');
    static $boxSource = $('#box-list-source');
    static $boxInWFOpt = $('#box-in-workflow-option');
    static $boxInWFEmp = $('#box-in-workflow-employee');
    static $boxInWFPos = $('#box-in-workflow-position');

    static transEle = $('#node-trans-factory');
    static dataNode = [
        {
            'title': NodeLoadDataHandle.transEle.attr('data-node-initial'),
            'code': 'initial',
            'code_node_system': 'initial',
            'is_system': true,
            'is_edit_all_zone': true,
            'order': 1,
        },
        {
            'title': NodeLoadDataHandle.transEle.attr('data-node-approved'),
            'code': 'approved',
            'code_node_system': 'approved',
            'is_system': true,
            'order': 2,
        },
        {
            'title': NodeLoadDataHandle.transEle.attr('data-node-completed'),
            'code': 'completed',
            'code_node_system': 'completed',
            'is_system': true,
            'order': 3,
        }
    ];
    static dataSystemNodeApproved = {
        'title': NodeLoadDataHandle.transEle.attr('data-node-approved'),
        'code': 'approved',
        'code_node_system': 'approved',
        'is_system': true,
        'order': 2,
    };
    static dataSystemNodeCompleted = {
        'title': NodeLoadDataHandle.transEle.attr('data-node-completed'),
        'code': 'completed',
        'code_node_system': 'completed',
        'is_system': true,
        'order': 3,
    };
    static dataSource = [
        {'id': '', 'title': 'Select...',},
        {'id': 2, 'title': NodeLoadDataHandle.transEle.attr('data-type-src-3')},
        {'id': 1, 'title': NodeLoadDataHandle.transEle.attr('data-type-src-2')},
    ];
    static dataSourceNote = {
        '1': NodeLoadDataHandle.transEle.attr('data-type-src-2-note'),
        '2': NodeLoadDataHandle.transEle.attr('data-type-src-3-note'),
    }
    static dataInWFOption = [
        {'id': '', 'title': 'Select...',},
        {'id': 2, 'title': NodeLoadDataHandle.transEle.attr('data-select-employee')},
        {'id': 1, 'title': NodeLoadDataHandle.transEle.attr('data-select-position')},
    ];
    static dataInWFPosition = [
        {'id': '', 'title': 'Select...',},
        {'id': 3, 'title': NodeLoadDataHandle.transEle.attr('data-select-beneficiary')},
        {'id': 2, 'title': NodeLoadDataHandle.transEle.attr('data-select-2nd-manager')},
        {'id': 1, 'title': NodeLoadDataHandle.transEle.attr('data-select-1st-manager')},
    ];

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
                let res1 = `<span class="badge badge-soft-primary mr-2">${state.data?.[customRes['res1']] ? state.data?.[customRes['res1']] : "--"}</span>`
                let res2 = `<span>${state.data?.[customRes['res2']] ? state.data?.[customRes['res2']] : "--"}</span>`
                return $(`<span>${res1} ${res2}</span>`);
            }
        }
        $ele.initSelect2(opts);
        return true;
    };

    static loadInitEmpData() {
        $.fn.callAjax2({
                'url': NodeLoadDataHandle.$initEmp.attr('data-url'),
                'method': "GET",
                'isDropdown': true,
            }
        ).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('employee_list') && Array.isArray(data.employee_list)) {
                        NodeLoadDataHandle.$initEmp.val(JSON.stringify(data?.['employee_list']));
                    }
                }
            }
        )
        return true;
    };

    static loadModalNode() {
        NodeLoadDataHandle.loadDDAction();
        NodeLoadDataHandle.loadActionShow();
        NodeLoadDataHandle.loadZone();
        NodeLoadDataHandle.loadInitS2(NodeLoadDataHandle.$boxSource, NodeLoadDataHandle.dataSource, {}, NodeLoadDataHandle.$modalNode);

        NodeDataTableHandle.dataTableCollabOutFormEmployee(JSON.parse(NodeLoadDataHandle.$initEmp.val()));
        NodeDataTableHandle.dataTableCollabInWFEmployee();
        NodeDataTableHandle.dataTableCollabInWFExitCon();
        NodeLoadDataHandle.$boxSource.val('').trigger('change');
        return true;
    };

    static loadResetModal() {
        // reset
        NodeLoadDataHandle.$titleNode.val('');
        NodeLoadDataHandle.$remarkNode.val('');
        NodeLoadDataHandle.$titleNode[0].removeAttribute('readonly');
        NodeLoadDataHandle.$remarkNode[0].removeAttribute('readonly');
        NodeLoadDataHandle.$nodeSysArea[0].setAttribute('hidden', 'true');
        NodeLoadDataHandle.$nodeCusArea[0].setAttribute('hidden', 'true');
        if (NodeLoadDataHandle.$modalNode[0].querySelector('.source-note')) {
            $(NodeLoadDataHandle.$modalNode[0].querySelector('.source-note')).empty();
        }
        if (NodeLoadDataHandle.$modalNode[0].querySelector('.out-form-emp-show')) {
            let $ele = $(NodeLoadDataHandle.$modalNode[0].querySelector('.out-form-emp-show'));
            $ele.empty();
        }
        NodeDataTableHandle.$tableInWF.DataTable().clear().draw();
        NodeDataTableHandle.$tableInWFExitCon.DataTable().clear().draw();
        return true;
    };

    static loadModalNodeDetail() {
        // new
        if (NodeLoadDataHandle.$btnSaveNode[0].getAttribute('data-save-type') === "0") {
            NodeLoadDataHandle.$nodeCusArea[0].removeAttribute('hidden');
            if (NodeLoadDataHandle.$modalNode[0].querySelector('.checkbox-action[data-id="0"]')) {
                if (NodeLoadDataHandle.$modalNode[0].querySelector('.checkbox-action[data-id="0"]').closest('.form-check')) {
                    NodeLoadDataHandle.$modalNode[0].querySelector('.checkbox-action[data-id="0"]').closest('.form-check').setAttribute('hidden', 'true');
                }
            }
        }
        // edit
        if (NodeLoadDataHandle.$btnSaveNode[0].getAttribute('data-save-type') === "1" && NodeLoadDataHandle.$btnSaveNode[0].getAttribute('data-order')) {
            for (let data of NodeLoadDataHandle.dataNode) {
                if (data?.['order'] === parseInt(NodeLoadDataHandle.$btnSaveNode[0].getAttribute('data-order'))) {
                    if (data?.['title']) {
                        NodeLoadDataHandle.$titleNode.val(data?.['title']);
                    }
                    if (data?.['remark']) {
                        NodeLoadDataHandle.$remarkNode.val(data?.['remark']);
                    }
                    if (data?.['actions']) {
                        if (data?.['actions'].length > 0) {
                            for (let eleCheck of NodeLoadDataHandle.$modalNode[0].querySelectorAll('.checkbox-action')) {
                                eleCheck.checked = data?.['actions'].includes(parseInt(eleCheck.getAttribute('data-id')));
                            }
                            NodeLoadDataHandle.loadActionShow();
                        }
                    }

                    if (data?.['order'] === 1) {
                        NodeLoadDataHandle.$titleNode[0].setAttribute('readonly', 'true');
                        NodeLoadDataHandle.$remarkNode[0].setAttribute('readonly', 'true');
                        NodeLoadDataHandle.$nodeSysArea[0].removeAttribute('hidden');
                        for (let eleCheck of NodeLoadDataHandle.$modalNode[0].querySelectorAll('.checkbox-action')) {
                            eleCheck.setAttribute('disabled', 'true');
                            eleCheck.checked = (parseInt(eleCheck.getAttribute('data-id')) === 0);
                        }
                        NodeLoadDataHandle.loadActionShow();
                        if (NodeLoadDataHandle.$nodeSysArea[0].querySelector('.checkbox-zone-edit-all')) {
                            NodeLoadDataHandle.$nodeSysArea[0].querySelector('.checkbox-zone-edit-all').checked = true;
                        }
                    }
                    if (data?.['order'] !== 1) {
                        NodeLoadDataHandle.$nodeCusArea[0].removeAttribute('hidden');
                        if (NodeLoadDataHandle.$modalNode[0].querySelector('.checkbox-action[data-id="0"]')) {
                            if (NodeLoadDataHandle.$modalNode[0].querySelector('.checkbox-action[data-id="0"]').closest('.form-check')) {
                                NodeLoadDataHandle.$modalNode[0].querySelector('.checkbox-action[data-id="0"]').closest('.form-check').setAttribute('hidden', 'true');
                            }
                        }
                    }

                    if (data?.['option_collaborator']) {
                        NodeLoadDataHandle.$boxSource.val(String(data?.['option_collaborator'])).trigger('change');
                        if (data?.['option_collaborator'] === 1) {
                            if (data?.['collab_out_form']?.['employee_list']) {
                                if (data?.['collab_out_form']?.['employee_list'].length > 0) {
                                    NodeDataTableHandle.$tableOFEmp.DataTable().rows().every(function () {
                                        let row = this.node();
                                        if (row.querySelector('.table-row-checkbox')) {
                                            row.querySelector('.table-row-checkbox').checked = false;
                                            if (row.querySelector('.table-row-checkbox').getAttribute('data-row')) {
                                                let dataRow = JSON.parse(row.querySelector('.table-row-checkbox').getAttribute('data-row'));
                                                if (data?.['collab_out_form']?.['employee_list'].includes(dataRow?.['id'])) {
                                                    row.querySelector('.table-row-checkbox').checked = true;
                                                }
                                            }
                                        }
                                    });
                                    if (NodeLoadDataHandle.$modalNode[0].querySelector('.btn-save-out-form-employee')) {
                                        $(NodeLoadDataHandle.$modalNode[0].querySelector('.btn-save-out-form-employee')).trigger('click');
                                    }
                                }
                            }
                            if (data?.['collab_out_form']?.['is_edit_all_zone']) {
                                if (NodeLoadDataHandle.$modalNode[0].querySelector('#collab-area-1').querySelector('.checkbox-zone-edit-all')) {
                                    NodeLoadDataHandle.$modalNode[0].querySelector('#collab-area-1').querySelector('.checkbox-zone-edit-all').checked = data?.['collab_out_form']?.['is_edit_all_zone'];
                                }
                            }
                            if (data?.['collab_out_form']?.['zone']) {
                                if (data?.['collab_out_form']?.['zone'].length > 0) {
                                    for (let eleCheck of NodeLoadDataHandle.$modalNode[0].querySelector('#collab-area-1').querySelectorAll('.checkbox-zone-edit')) {
                                        eleCheck.checked = data?.['collab_out_form']?.['zone'].includes(parseInt(eleCheck.getAttribute('data-id')));
                                    }
                                }
                            }
                            if (data?.['collab_out_form']?.['zone_hidden']) {
                                if (data?.['collab_out_form']?.['zone_hidden'].length > 0) {
                                    for (let eleCheck of NodeLoadDataHandle.$modalNode[0].querySelector('#collab-area-1').querySelectorAll('.checkbox-zone-hidden')) {
                                        eleCheck.checked = data?.['collab_out_form']?.['zone_hidden'].includes(parseInt(eleCheck.getAttribute('data-id')));
                                    }
                                }
                            }
                        }
                        if (data?.['option_collaborator'] === 2) {
                            NodeDataTableHandle.$tableInWF.DataTable().clear().draw();
                            NodeDataTableHandle.$tableInWF.DataTable().rows.add(data?.['collab_in_workflow']).draw();
                        }

                    }
                    break;
                }
            }

        }
    };

    static loadCollabArea() {
        for (let eleArea of NodeLoadDataHandle.$modalNode[0].querySelectorAll('.collab-area')) {
            eleArea.setAttribute('hidden', 'true');
        }
        if (NodeLoadDataHandle.$boxSource.val()) {
            let idAreaShow = 'collab-area-' + String(NodeLoadDataHandle.$boxSource.val());
            NodeLoadDataHandle.$modalNode[0].querySelector(`#${idAreaShow}`).removeAttribute('hidden');
            if (NodeLoadDataHandle.$modalNode[0].querySelector('.source-note')) {
                let $ele = $(NodeLoadDataHandle.$modalNode[0].querySelector('.source-note'));
                $ele.empty().append(`<span>${NodeLoadDataHandle.transEle.attr('data-type-src-note')}: ${NodeLoadDataHandle.dataSourceNote[String(NodeLoadDataHandle.$boxSource.val())]}</span>`);
            }
        }
        NodeLoadDataHandle.loadCollabElements();
        return true;
    };

    static loadCollabElements() {
        let $canvas = $('#inWFCanvas');
        NodeLoadDataHandle.loadInitS2(NodeLoadDataHandle.$boxInWFOpt, NodeLoadDataHandle.dataInWFOption, {}, $canvas);
        NodeLoadDataHandle.loadInitS2(NodeLoadDataHandle.$boxInWFPos, NodeLoadDataHandle.dataInWFPosition, {}, $canvas);
        NodeLoadDataHandle.loadInitS2(NodeLoadDataHandle.$boxInWFEmp, JSON.parse(NodeLoadDataHandle.$initEmp.val()), {}, $canvas);
        return true;
    };

    static loadDDAction() {
        let txtAction = $('#wf_action').text();
        if (NodeLoadDataHandle.$modalNode[0].querySelector('.action-list') && txtAction) {
            let $ele = $(NodeLoadDataHandle.$modalNode[0].querySelector('.action-list'));
            let htmlActions = ``;
            let nodeAction = JSON.parse(txtAction);
            for (let key in nodeAction) {
                htmlActions += `<div class="form-check form-check-lg">
                                    <input type="checkbox" class="form-check-input checkbox-action" data-id="${key}">
                                    <label class="form-check-label action-title">${nodeAction[key]}</label>
                                </div>`;
            }
            $ele.empty().append(`<div data-simplebar class="nicescroll-bar">${htmlActions}</div>`);
        }
        return true;
    };

    static loadCheckActionGr(ele) {
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
        if (ele.checked === true) {
            for (let eleCheck of NodeLoadDataHandle.$modalNode[0].querySelectorAll('.checkbox-action')) {
                if ($(eleCheck).attr('data-id') !== '0') {
                    eleCheck.checked = groupCheckAction[checkedID].includes($(eleCheck).attr('data-id'));
                }
            }
        } else {
            for (let eleCheck of NodeLoadDataHandle.$modalNode[0].querySelectorAll('.checkbox-action')) {
                if ($(eleCheck).attr('data-id') !== '0') {
                    eleCheck.checked = groupUnCheckAction[checkedID].includes($(eleCheck).attr('data-id'));
                }
            }
        }
    };

    static loadActionShow() {
        if (NodeLoadDataHandle.$modalNode[0].querySelector('.action-show')) {
            let $ele = $(NodeLoadDataHandle.$modalNode[0].querySelector('.action-show'));
            let htmlShow = ``;
            for (let eleChecked of NodeLoadDataHandle.$modalNode[0].querySelectorAll('.checkbox-action:checked')) {
                if (eleChecked.closest('.form-check')) {
                    if (eleChecked.closest('.form-check').querySelector('.action-title')) {
                        htmlShow += `<div class="chip chip-outline-primary bg-green-light-5 mr-1 mb-1">
                                        <span><span class="chip-text">${eleChecked.closest('.form-check').querySelector('.action-title').innerHTML}</span></span>
                                    </div>`;
                    }
                }
            }
            $ele.empty().append(htmlShow);
        }
        return true;
    };

    static loadZoneData() {
        let result = {};
        let i = 1;
        $('#table_workflow_zone').DataTable().rows().every(function () {
            let row = this.node();
            result[i] = row.children[1].children[0].innerHTML;
            i++;
        });
        return result;
    };

    static loadZone() {
        let htmlEdit = `<div class="form-check form-check-lg">
                            <input type="checkbox" class="form-check-input checkbox-zone-edit-all">
                            <label class="form-check-label zone-title">${NodeLoadDataHandle.transEle.attr('data-zone-all-data')}</label>
                        </div>`;
        let htmlHidden = ``;
        let zoneData = NodeLoadDataHandle.loadZoneData();
        for (let key in zoneData) {
            htmlEdit += `<div class="form-check form-check-lg">
                            <input type="checkbox" class="form-check-input checkbox-zone-edit" data-id="${key}">
                            <label class="form-check-label zone-title">${zoneData?.[key]}</label>
                        </div>`;
            htmlHidden += `<div class="form-check form-check-lg">
                            <input type="checkbox" class="form-check-input checkbox-zone-hidden" data-id="${key}">
                            <label class="form-check-label zone-title">${zoneData?.[key]}</label>
                        </div>`;
        }
        for (let ele of NodeLoadDataHandle.$modalNode[0].querySelectorAll('.zone-edit')) {
            $(ele).empty().append(`<div data-simplebar class="nicescroll-bar">${htmlEdit}</div>`);
        }
        for (let ele of NodeLoadDataHandle.$modalNode[0].querySelectorAll('.zone-hidden')) {
            $(ele).empty().append(`<div data-simplebar class="nicescroll-bar">${htmlHidden}</div>`);
        }
        return true;
    };

    static loadCheckZone(ele) {
        if (ele.checked === true) {
            let sysNodeArea = ele.closest('#node-system-area');
            if (sysNodeArea) {
                if (ele.classList.contains('checkbox-zone-edit-all')) {
                    for (let eleCheck of sysNodeArea.querySelectorAll('.checkbox-zone-edit')) {
                        eleCheck.checked = false;
                    }
                }
                if (ele.classList.contains('checkbox-zone-edit')) {
                    if (sysNodeArea.querySelector('.checkbox-zone-edit-all')) {
                        sysNodeArea.querySelector('.checkbox-zone-edit-all').checked = false;
                    }
                    let dataId = ele.getAttribute('data-id');
                    if (sysNodeArea.querySelector(`.checkbox-zone-hidden[data-id="${dataId}"]:checked`)) {
                        ele.checked = false;
                        $.fn.notifyB({description: NodeLoadDataHandle.transEle.attr('data-valid-zone-edit')}, 'failure');
                        return false;
                    }
                }
                if (ele.classList.contains('checkbox-zone-hidden')) {
                    let dataId = ele.getAttribute('data-id');
                    if (sysNodeArea.querySelector(`.checkbox-zone-edit[data-id="${dataId}"]:checked`)) {
                        ele.checked = false;
                        $.fn.notifyB({description: NodeLoadDataHandle.transEle.attr('data-valid-zone-hidden')}, 'failure');
                        return false;
                    }
                }
            }
            let collabArea = ele.closest('.collab-area');
            if (collabArea) {
                if (ele.classList.contains('checkbox-zone-edit-all')) {
                    for (let eleCheck of collabArea.querySelectorAll('.checkbox-zone-edit')) {
                        eleCheck.checked = false;
                    }
                }
                if (ele.classList.contains('checkbox-zone-edit')) {
                    if (collabArea.querySelector('.checkbox-zone-edit-all')) {
                        collabArea.querySelector('.checkbox-zone-edit-all').checked = false;
                    }
                    let dataId = ele.getAttribute('data-id');
                    if (collabArea.querySelector(`.checkbox-zone-hidden[data-id="${dataId}"]:checked`)) {
                        ele.checked = false;
                        $.fn.notifyB({description: NodeLoadDataHandle.transEle.attr('data-valid-zone-edit')}, 'failure');
                        return false;
                    }
                }
                if (ele.classList.contains('checkbox-zone-hidden')) {
                    let dataId = ele.getAttribute('data-id');
                    if (collabArea.querySelector(`.checkbox-zone-edit[data-id="${dataId}"]:checked`)) {
                        ele.checked = false;
                        $.fn.notifyB({description: NodeLoadDataHandle.transEle.attr('data-valid-zone-hidden')}, 'failure');
                        return false;
                    }
                }
            }
        }
        return true;
    };

    // out form
    static loadOFEmpShow() {
        if (NodeLoadDataHandle.$modalNode[0].querySelector('.out-form-emp-show')) {
            let $ele = $(NodeLoadDataHandle.$modalNode[0].querySelector('.out-form-emp-show'));
            let htmlShow = ``;
            NodeDataTableHandle.$tableOFEmp.DataTable().rows().every(function () {
                let row = this.node();
                if (row.querySelector('.table-row-checkbox:checked')) {
                    if (row.querySelector('.table-row-checkbox').getAttribute('data-row')) {
                        let dataRow = JSON.parse(row.querySelector('.table-row-checkbox').getAttribute('data-row'));
                        htmlShow += `<div class="chip chip-outline-primary mr-1 mb-1 out-form-emp-show" data-id="${dataRow?.['id']}">
                                        <span><span class="chip-text">${dataRow?.['full_name']}</span></span>
                                    </div>`;
                    }
                }
            });
            $ele.empty().append(htmlShow);
        }
        return true;
    };

    // in workflow
    static loadInWFArea() {
        for (let eleArea of NodeLoadDataHandle.$modalNode[0].querySelectorAll('.in-wf-opt-area')) {
            eleArea.setAttribute('hidden', 'true');
        }
        let idAreaShow = 'in-wf-opt-area-' + String(NodeLoadDataHandle.$boxInWFOpt.val());
        NodeLoadDataHandle.$modalNode[0].querySelector(`#${idAreaShow}`).removeAttribute('hidden');
        return true;
    };

    static loadInWFShow() {
        let dataAdd = {};
        if (NodeLoadDataHandle.$boxInWFOpt.val() === '1') {
            if (NodeLoadDataHandle.$boxInWFPos.val()) {
                let data = SelectDDControl.get_data_from_idx(NodeLoadDataHandle.$boxInWFPos, NodeLoadDataHandle.$boxInWFPos.val());
                if (data) {
                    dataAdd['in_wf_option'] = 1;
                    dataAdd['position_choice'] = parseInt(data?.['id']);
                }
            }
        }
        if (NodeLoadDataHandle.$boxInWFOpt.val() === '2') {
            if (NodeLoadDataHandle.$boxInWFEmp.val()) {
                let data = SelectDDControl.get_data_from_idx(NodeLoadDataHandle.$boxInWFEmp, NodeLoadDataHandle.$boxInWFEmp.val());
                if (data) {
                    dataAdd['in_wf_option'] = 2;
                    dataAdd['employee'] = data?.['id'];
                }
            }
        }
        if (NodeLoadDataHandle.$modalNode[0].querySelector('#collab-area-2')) {
            if (NodeLoadDataHandle.$modalNode[0].querySelector('#collab-area-2').querySelector('.checkbox-zone-edit-all:checked')) {
                dataAdd['is_edit_all_zone'] = true;
            }
            let zone = [];
            for (let eleChecked of NodeLoadDataHandle.$modalNode[0].querySelector('#collab-area-2').querySelectorAll('.checkbox-zone-edit:checked')) {
                if (eleChecked.getAttribute('data-id')) {
                    zone.push(parseInt(eleChecked.getAttribute('data-id')));
                }
            }
            dataAdd['zone'] = zone;
            let zoneHidden = [];
            for (let eleChecked of NodeLoadDataHandle.$modalNode[0].querySelector('#collab-area-2').querySelectorAll('.checkbox-zone-hidden:checked')) {
                if (eleChecked.getAttribute('data-id')) {
                    zoneHidden.push(parseInt(eleChecked.getAttribute('data-id')));
                }
            }
            dataAdd['zone_hidden'] = zoneHidden;
        }
        NodeDataTableHandle.$tableInWF.DataTable().row.add(dataAdd).draw().node();
        return true;
    };

    // dbt
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

    // load detail
    static loadDetail(data) {
        NodeLoadDataHandle.dataNode = data;
        NodeLoadDataHandle.loadModalNode();

        // FlowJsP.init();
    };

}

// DataTable
class NodeDataTableHandle {
    static $tableOFEmp = $('#table-out-form-employee');
    static $tableInWF = $('#table-in-workflow');
    static $tableInWFExitCon = $('#table-in-workflow-exit-condition');

    static dataTableCollabOutFormEmployee(data) {
        NodeDataTableHandle.$tableOFEmp.not('.dataTable').DataTableDefault({
            data: data ? data : [],
            pageLength: 8,
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        let checked = '';
                        if (row?.['is_checked']) {
                            checked = 'checked';
                        }
                        return `<div class="d-flex align-items-center">
                                    <div class="form-check form-check-lg">
                                        <input
                                            type="checkbox" 
                                            class="form-check-input table-row-checkbox"
                                            data-id="${row?.['id']}"
                                            data-title="${row?.['full_name']}"
                                            data-row="${dataRow}"
                                            ${checked}
                                        >
                                    </div>
                                    <span class="badge badge-primary mr-2 table-row-code">${row?.['code']}</span>
                                    <span class="badge badge-primary badge-outline table-row-title">${row?.['full_name']}</span>
                                </div>`;
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<span class="badge badge-soft-blue">${row?.['group']?.['title'] ? row?.['group']?.['title'] : ''}</span>`;
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        if (row.hasOwnProperty('role') && Array.isArray(row?.['role'])) {
                            let result = [];
                            row?.['role'].map(item => item?.['title'] ? result.push(`<span class="badge badge-soft-pink mb-1 mr-1">` + item?.['title'] + `</span>`) : null);
                            return result.join(" ");
                        }
                        return '';
                    }
                },
            ],
        });
    };

    static dataTableCollabInWFEmployee(data) {
        NodeDataTableHandle.$tableInWF.not('.dataTable').DataTableDefault({
            data: data ? data : [],
            ordering: false,
            paginate: false,
            info: false,
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        if (row?.['employee']) {
                            let dataEmp = SelectDDControl.get_data_from_idx(NodeLoadDataHandle.$boxInWFEmp, row?.['employee']);
                            if (dataEmp) {
                                return `<span class="table-row-title badge badge-primary badge-outline" data-row="${dataRow}">${dataEmp?.['full_name'] ? dataEmp?.['full_name'] : ''}</span>`;
                            }
                        }
                        if (row?.['position_choice']) {
                            for (let dataPos of NodeLoadDataHandle.dataInWFPosition) {
                                if (dataPos?.['id'] === row?.['position_choice']) {
                                    return `<span class="table-row-title badge badge-warning badge-outline" data-row="${dataRow}">${dataPos?.['title']}</span>`;
                                }
                            }
                        }
                        return ``;
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        if (row?.['employee']) {
                            let dataEmp = SelectDDControl.get_data_from_idx(NodeLoadDataHandle.$boxInWFEmp, row?.['employee']);
                            if (dataEmp) {
                                if (dataEmp.hasOwnProperty('role') && Array.isArray(dataEmp?.['role'])) {
                                    let result = [];
                                    dataEmp?.['role'].map(item => item?.['title'] ? result.push(`<span class="badge badge-soft-pink mb-1 mr-1">${item?.['title']}</span>`) : null);
                                    return result.join(" ");
                                }
                            }
                        }
                        return '';
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        if (row?.['is_edit_all_zone'] === true) {
                            return `<p>${NodeLoadDataHandle.transEle.attr('data-zone-all-data')}</p>`;
                        }
                        if (row.hasOwnProperty('zone') && Array.isArray(row?.['zone'])) {
                            let resultZone = ``;
                            let zoneData = NodeLoadDataHandle.loadZoneData();
                            for (let zone of row?.['zone']) {
                                resultZone += `<p>${zoneData?.[zone]}</p>`;
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
                            let zoneData = NodeLoadDataHandle.loadZoneData();
                            for (let zone of row?.['zone_hidden']) {
                                resultZone += `<p>${zoneData?.[zone]}</p>`;
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
            drawCallback: function () {
                // add css to Dtb
                NodeLoadDataHandle.loadCssToDtb(NodeDataTableHandle.$tableInWF[0].id);
            },
        });
    };

    static dataTableCollabInWFExitCon(data) {
        NodeDataTableHandle.$tableInWFExitCon.not('.dataTable').DataTableDefault({
            data: data ? data : [],
            ordering: false,
            searching: false,
            paginate: false,
            info: false,
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        let nodeActionRaw = $('#wf_action').text();
                        if (nodeActionRaw) {
                            let nodeAction = JSON.parse(nodeActionRaw);
                            return `<b class="table-row-action" data-row="${dataRow}">${nodeAction[row?.['action']]}</b>`;
                        }
                        return `<b>--</b>`;
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        if (row?.['action'] === 1) {
                            return `<input type="text" class="form-control table-row-min-collaborator validated-number" value="${row?.['min_collaborator']}">`;
                        }
                        return `<span class="table-row-min-collaborator">${row?.['min_collaborator']}</span>`;
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<span class="table-row-next-node">${row?.['next_node']}</span>`;
                    }
                },
            ],
            drawCallback: function () {
                // add css to Dtb
                NodeLoadDataHandle.loadCssToDtb(NodeDataTableHandle.$tableInWFExitCon[0].id);
            },
        });
    };

}

// Store data
class NodeStoreHandle {
    static storeNode() {
        if (NodeLoadDataHandle.$btnSaveNode[0].getAttribute('data-save-type')) {
            if (NodeLoadDataHandle.$btnSaveNode[0].getAttribute('data-save-type') === '0') {  // new
                let newData = NodeStoreHandle.storeSetup();
                if (NodeLoadDataHandle.dataNode.length >= 3) {
                    NodeLoadDataHandle.dataNode.splice(-2, 2);
                }
                newData['order'] = NodeLoadDataHandle.dataNode.length + 1;
                NodeLoadDataHandle.dataNode.push(newData);
                NodeLoadDataHandle.dataSystemNodeApproved['order'] = NodeLoadDataHandle.dataNode.length + 1;
                NodeLoadDataHandle.dataSystemNodeCompleted['order'] = NodeLoadDataHandle.dataNode.length + 2;
                NodeLoadDataHandle.dataNode.push(NodeLoadDataHandle.dataSystemNodeApproved);
                NodeLoadDataHandle.dataNode.push(NodeLoadDataHandle.dataSystemNodeCompleted);
            }
            if (NodeLoadDataHandle.$btnSaveNode[0].getAttribute('data-save-type') === '1') {  // edit
                if (NodeLoadDataHandle.$btnSaveNode[0].getAttribute('data-order')) {
                    for (let i = 0; i < NodeLoadDataHandle.dataNode.length; i++) {
                        if (NodeLoadDataHandle.dataNode[i]?.['order'] === parseInt(NodeLoadDataHandle.$btnSaveNode[0].getAttribute('data-order'))) {
                            let data = NodeStoreHandle.storeSetup();
                            if (NodeLoadDataHandle.dataNode[i]?.['order'] === 1) {
                                if (data?.['actions'])
                                NodeLoadDataHandle.dataNode[i]['actions'] = data?.['actions'];
                            }
                            if (NodeLoadDataHandle.dataNode[i]?.['order'] > 1) {
                                NodeLoadDataHandle.dataNode[i] = data;
                                NodeLoadDataHandle.dataNode[i]['order'] = parseInt(NodeLoadDataHandle.$btnSaveNode[0].getAttribute('data-order'));
                            }
                            break;
                        }
                    }
                }
            }
            FlowJsP.init();
        }
        return true;
    };

    static storeSetup() {
        let dataStore = {};
        dataStore['title'] = NodeLoadDataHandle.$titleNode.val();
        dataStore['remark'] = NodeLoadDataHandle.$remarkNode.val();
        dataStore['actions'] = [];
        for (let eleChecked of NodeLoadDataHandle.$modalNode[0].querySelectorAll('.checkbox-action:checked')) {
            if (eleChecked.getAttribute('data-id')) {
                dataStore['actions'].push(parseInt(eleChecked.getAttribute('data-id')));
            }
        }
        // system node
        if (NodeLoadDataHandle.$btnSaveNode[0].getAttribute('data-save-type') === "1" && NodeLoadDataHandle.$btnSaveNode[0].getAttribute('data-order')) {
            if (NodeLoadDataHandle.$btnSaveNode[0].getAttribute('data-order') === 1) {
                return dataStore;
            }
        }
        // custom node
        if (NodeLoadDataHandle.$boxSource.val() === '1') {
            dataStore['option_collaborator'] = 1;
            dataStore['collab_out_form'] = {};
            let empList = [];
            for (let eleShow of NodeLoadDataHandle.$modalNode[0].querySelectorAll('.out-form-emp-show')) {
                if (eleShow.getAttribute('data-id')) {
                    empList.push(eleShow.getAttribute('data-id'));
                }
            }
            dataStore['collab_out_form']['employee_list'] = empList;
            if (NodeLoadDataHandle.$modalNode[0].querySelector('.checkbox-zone-edit-all:checked')) {
                dataStore['collab_out_form']['is_edit_all_zone'] = true;
            }
            if (NodeLoadDataHandle.$modalNode[0].querySelector('#collab-area-1')) {
                if (NodeLoadDataHandle.$modalNode[0].querySelector('#collab-area-1').querySelector('.checkbox-zone-edit-all:checked')) {
                    dataStore['collab_out_form']['is_edit_all_zone'] = true;
                }
                let zone = [];
                for (let eleChecked of NodeLoadDataHandle.$modalNode[0].querySelector('#collab-area-1').querySelectorAll('.checkbox-zone-edit:checked')) {
                    if (eleChecked.getAttribute('data-id')) {
                        zone.push(parseInt(eleChecked.getAttribute('data-id')));
                    }
                }
                dataStore['collab_out_form']['zone'] = zone;
                let zoneHidden = [];
                for (let eleChecked of NodeLoadDataHandle.$modalNode[0].querySelector('#collab-area-1').querySelectorAll('.checkbox-zone-hidden:checked')) {
                    if (eleChecked.getAttribute('data-id')) {
                        zoneHidden.push(parseInt(eleChecked.getAttribute('data-id')));
                    }
                }
                dataStore['collab_out_form']['zone_hidden'] = zoneHidden;
            }
        }
        if (NodeLoadDataHandle.$boxSource.val() === '2') {
            dataStore['option_collaborator'] = 2;
            dataStore['collab_in_workflow'] = [];
            NodeDataTableHandle.$tableInWF.DataTable().rows().every(function () {
                let row = this.node();
                if (row.querySelector('.table-row-title')) {
                    if (row.querySelector('.table-row-title').getAttribute('data-row')) {
                        let dataRow = JSON.parse(row.querySelector('.table-row-title').getAttribute('data-row'));
                        dataStore['collab_in_workflow'].push(dataRow);
                    }
                }
            });
        }
        dataStore['is_system'] = false;
        return dataStore;
    };
}

// Submit Form
class NodeSubmitHandle {

    static setupDataFlowChart() {
        return NodeLoadDataHandle.dataNode;
    };

    static setupDataSubmit() {
        return NodeLoadDataHandle.dataNode;
    };

    // static setupDataSubmit(is_flowchart = false) {
    //     let result = [];
    //     let table = NodeDataTableHandle.tableNode;
    //     let field_list = [
    //         'title',
    //         'code',
    //         'remark',
    //         'actions',
    //         'option_collaborator',
    //         'zone_initial_node',
    //         'zone_hidden_initial_node',
    //         'order',
    //         'is_system',
    //         'code_node_system',
    //         'condition',
    //         'collab_in_form',
    //         'collab_out_form',
    //         'collab_in_workflow',
    //         'coordinates',
    //         'is_edit_all_zone',
    //     ];
    //     for (let i = 0; i < table[0].tBodies[0].rows.length; i++) {
    //         let total_in_runtime = 1;
    //         let total_config = 1;
    //         let row = table[0].tBodies[0].rows[i];
    //         let eleTitle = row?.querySelector('.table-row-title');
    //         if (eleTitle) {
    //             let dataRowRaw = eleTitle.getAttribute('data-row');
    //             if (dataRowRaw) {
    //                 let dataRow = JSON.parse(dataRowRaw);
    //                 // setup data actions on Node
    //                 let actions = [];
    //                 for (let eleChecked of row.querySelectorAll('.check-action-node:checked')) {
    //                     actions.push(parseInt($(eleChecked).attr('data-id')));
    //                 }
    //                 dataRow['actions'] = actions;
    //                 let modalCollab = row.querySelector('.modal-collab');
    //                 if (dataRow?.['is_system'] === true) { // SYSTEM NODES
    //                     if (dataRow?.['code'] === 'initial') {
    //                         let initialArea = modalCollab.querySelector('.collab-initial-area');
    //                         // check data actions
    //                         if (dataRow['actions'].length <= 0) {
    //                             $.fn.notifyB({description: NodeLoadDataHandle.transEle.attr('data-complete-node')}, 'failure');
    //                             return false;
    //                         }
    //                         let zoneAllData = initialArea.querySelector('.checkbox-node-zone-all');
    //                         if (zoneAllData) {
    //                             if (zoneAllData.checked === true) {
    //                                 dataRow['is_edit_all_zone'] = true;
    //                                 dataRow['zone_initial_node'] = [];
    //                             } else {
    //                                 dataRow['is_edit_all_zone'] = false;
    //                                 let zone_initial_node = [];
    //                                 for (let eleChecked of initialArea.querySelectorAll('.checkbox-node-zone:checked')) {
    //                                     zone_initial_node.push(parseInt($(eleChecked).attr('data-id')));
    //                                 }
    //                                 dataRow['zone_initial_node'] = zone_initial_node;
    //                             }
    //                         }
    //                         let zone_hidden_initial_node = [];
    //                         for (let eleChecked of initialArea.querySelectorAll('.checkbox-node-zone-hidden:checked')) {
    //                             zone_hidden_initial_node.push(parseInt($(eleChecked).attr('data-id')));
    //                         }
    //                         dataRow['zone_hidden_initial_node'] = zone_hidden_initial_node;
    //                     } else if (dataRow?.['code'] === 'approved') {
    //                         dataRow['order'] = (table[0].tBodies[0].rows.length - 1);
    //                     } else if (dataRow?.['code'] === 'completed') {
    //                         dataRow['order'] = table[0].tBodies[0].rows.length;
    //                     }
    //                 } else { // COLLAB NODES
    //                     // setup title & remark node collab
    //                     if (eleTitle.value) {
    //                         dataRow['title'] = eleTitle.value;
    //                     } else {
    //                         $.fn.notifyB({description: NodeLoadDataHandle.transEle.attr('data-complete-node')}, 'failure');
    //                         return false;
    //                     }
    //                     let eleRemark = row?.querySelector('.table-row-remark');
    //                     if (eleRemark) {
    //                         dataRow['remark'] = eleRemark.value;
    //                     }
    //                     // check data actions
    //                     if (dataRow['actions'].length <= 0) {
    //                         $.fn.notifyB({description: NodeLoadDataHandle.transEle.attr('data-complete-node')}, 'failure');
    //                         return false;
    //                     }
    //                     // reset data collab_in_form, collab_out_form, collab_in_workflow when update
    //                     dataRow['collab_in_form'] = {};
    //                     dataRow['collab_out_form'] = {};
    //                     dataRow['collab_in_workflow'] = [];
    //                     // setup data collab depend on option_collaborator
    //                     let boxListSource = modalCollab.querySelector('.box-list-source');
    //                     if ($(boxListSource).val() === '1') { // In Form
    //                         dataRow['option_collaborator'] = 0;
    //                         let dataInForm = {};
    //                         let IFArea = modalCollab.querySelector('.collab-in-form-area');
    //                         if ($(IFArea?.querySelector('.box-in-form-property')).val()) {
    //                             dataInForm['app_property'] = $(IFArea?.querySelector('.box-in-form-property')).val();
    //                         } else {
    //                             $.fn.notifyB({description: NodeLoadDataHandle.transEle.attr('data-complete-node')}, 'failure');
    //                             return false;
    //                         }
    //                         let zoneAllData = IFArea.querySelector('.checkbox-node-zone-all');
    //                         if (zoneAllData) {
    //                             if (zoneAllData.checked === true) {
    //                                 dataInForm['is_edit_all_zone'] = true;
    //                                 dataInForm['zone'] = [];
    //                             } else {
    //                                 dataInForm['is_edit_all_zone'] = false;
    //                                 if ($(IFArea?.querySelector('.node-zone-submit')).val()) {
    //                                     dataInForm['zone'] = JSON.parse($(IFArea?.querySelector('.node-zone-submit')).val());
    //                                 }
    //                             }
    //                         }
    //                         if ($(IFArea?.querySelector('.node-zone-hidden-submit')).val()) {
    //                             dataInForm['zone_hidden'] = JSON.parse($(IFArea?.querySelector('.node-zone-hidden-submit')).val());
    //                         }
    //                         dataRow['collab_in_form'] = dataInForm;
    //                     } else if ($(boxListSource).val() === '2') { // Out Form
    //                         dataRow['option_collaborator'] = 1;
    //                         let dataOutForm = {};
    //                         let OFArea = modalCollab.querySelector('.collab-out-form-area');
    //                         if ($(OFArea?.querySelector('.node-out-form-employee-submit')).val()) {
    //                             dataOutForm['employee_list'] = JSON.parse($(OFArea?.querySelector('.node-out-form-employee-submit')).val());
    //                         } else {
    //                             $.fn.notifyB({description: NodeLoadDataHandle.transEle.attr('data-complete-node')}, 'failure');
    //                             return false;
    //                         }
    //                         let zoneAllData = OFArea.querySelector('.checkbox-node-zone-all');
    //                         if (zoneAllData) {
    //                             if (zoneAllData.checked === true) {
    //                                 dataOutForm['is_edit_all_zone'] = true;
    //                                 dataOutForm['zone'] = [];
    //                             } else {
    //                                 dataOutForm['is_edit_all_zone'] = false;
    //                                 if ($(OFArea?.querySelector('.node-zone-submit')).val()) {
    //                                     dataOutForm['zone'] = JSON.parse($(OFArea?.querySelector('.node-zone-submit')).val());
    //                                 }
    //                             }
    //                         }
    //                         if ($(OFArea?.querySelector('.node-zone-hidden-submit')).val()) {
    //                             dataOutForm['zone_hidden'] = JSON.parse($(OFArea?.querySelector('.node-zone-hidden-submit')).val());
    //                         }
    //                         if (dataOutForm <= 0) {
    //                             $.fn.notifyB({description: NodeLoadDataHandle.transEle.attr('data-complete-node')}, 'failure');
    //                             return false;
    //                         }
    //                         dataRow['collab_out_form'] = dataOutForm;
    //                         if (is_flowchart === true) {
    //                             total_config = dataOutForm?.['employee_list'].length;
    //                         }
    //                     } else if ($(boxListSource).val() === '3') { // In Workflow
    //                         dataRow['option_collaborator'] = 2;
    //                         let dataInWF = [];
    //                         let InWFArea = modalCollab?.querySelector('.collab-in-workflow-area');
    //                         let tableInWF = InWFArea?.querySelector('.table-in-workflow-employee');
    //                         $(tableInWF).DataTable().rows().every(function () {
    //                             let rowInWF = this.node();
    //                             let dataRowInWFRaw = rowInWF?.querySelector('.table-row-title').getAttribute('data-row');
    //                             if (dataRowInWFRaw) {
    //                                 let dataRowInWF = JSON.parse(dataRowInWFRaw);
    //                                 let zone = [];
    //                                 let zone_hidden = [];
    //                                 let is_edit_all_zone = false;
    //                                 if (dataRowInWF?.['is_edit_all_zone'] === true) {
    //                                     is_edit_all_zone = true;
    //                                 } else {
    //                                     for (let zoneData of dataRowInWF?.['zone']) {  // In WF employee has different zones => need to for every row to get zones
    //                                         zone.push(parseInt(zoneData?.['id']));
    //                                     }
    //                                 }
    //                                 for (let zoneData of dataRowInWF?.['zone_hidden']) {  // In WF employee has different zones => need to for every row to get zones
    //                                     zone_hidden.push(parseInt(zoneData?.['id']));
    //                                 }
    //                                 if (dataRowInWF?.['in_wf_option']) {
    //                                     if (dataRowInWF?.['employee']?.['id'] || dataRowInWF?.['position_choice']?.['id']) {
    //                                         dataInWF.push({
    //                                             'in_wf_option': dataRowInWF?.['in_wf_option'],
    //                                             'employee': dataRowInWF?.['employee']?.['id'] ? dataRowInWF?.['employee']?.['id'] : null,
    //                                             'position_choice': dataRowInWF?.['position_choice']?.['id'] ? dataRowInWF?.['position_choice']?.['id'] : null,
    //                                             'zone': zone,
    //                                             'zone_hidden': zone_hidden,
    //                                             'is_edit_all_zone': is_edit_all_zone,
    //                                         })
    //                                     } else {
    //                                         $.fn.notifyB({description: NodeLoadDataHandle.transEle.attr('data-complete-node')}, 'failure');
    //                                         return false;
    //                                     }
    //                                 }
    //                             }
    //                         });
    //                         if (dataInWF <= 0) {
    //                             $.fn.notifyB({description: NodeLoadDataHandle.transEle.attr('data-complete-node')}, 'failure');
    //                             return false;
    //                         }
    //                         dataRow['collab_in_workflow'] = dataInWF;
    //                         if (is_flowchart === true) {
    //                             total_in_runtime = dataInWF.length;
    //                             total_config = dataInWF.length;
    //                         }
    //                     }
    //                 }
    //                 filterFieldList(field_list, dataRow);
    //                 if (is_flowchart === true) {
    //                     dataRow['collaborators'] = {
    //                         'option': dataRow?.['option_collaborator'],
    //                         'total_in_runtime': total_in_runtime,
    //                         'total_config': total_config,
    //                     }
    //                 }
    //                 result.push(dataRow);
    //             }
    //         }
    //     }
    //     return result;
    // };
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
