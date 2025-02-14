// LoadData
class NodeLoadDataHandle {
    static $form = $('#form-create_workflow');

    static $nodeDragBox = $('#node_dragbox');
    static $flowChart = $('#flowchart_workflow');
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
            'zone_initial_node': [],
            'zone_hidden_initial_node': [],
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
        {'id': 1, 'title': NodeLoadDataHandle.transEle.attr('data-type-src-2')},
        {'id': 2, 'title': NodeLoadDataHandle.transEle.attr('data-type-src-3')},
    ];
    static dataSourceNote = {
        '1': NodeLoadDataHandle.transEle.attr('data-type-src-2-note'),
        '2': NodeLoadDataHandle.transEle.attr('data-type-src-3-note'),
    }
    static dataInWFOption = [
        {'id': '', 'title': 'Select...',},
        {'id': 1, 'title': NodeLoadDataHandle.transEle.attr('data-select-position')},
        {'id': 2, 'title': NodeLoadDataHandle.transEle.attr('data-select-employee')},
    ];
    static dataInWFPosition = [
        {'id': '', 'title': 'Select...',},
        {'id': 1, 'title': NodeLoadDataHandle.transEle.attr('data-select-beneficiary')},
        {'id': 2, 'title': NodeLoadDataHandle.transEle.attr('data-select-1st-manager')},
        {'id': 3, 'title': NodeLoadDataHandle.transEle.attr('data-select-2nd-manager')},
        {'id': 4, 'title': NodeLoadDataHandle.transEle.attr('data-select-upper-manager')},
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
                let res1 = `<span class="badge badge-soft-light mr-2">${state.data?.[customRes['res1']] ? state.data?.[customRes['res1']] : "--"}</span>`
                let res2 = `<span>${state.data?.[customRes['res2']] ? state.data?.[customRes['res2']] : "--"}</span>`
                return $(`<span>${res1} ${res2}</span>`);
            }
        }
        $ele.initSelect2(opts);
        return true;
    };

    static loadEventCheckbox($area, trigger = false) {
        // Use event delegation for dynamically added elements
        $area.on('click', '.form-check', function (event) {
            // Prevent handling if the direct checkbox is clicked
            if (event.target.classList.contains('form-check-input')) {
                return; // Let the checkbox handler handle this
            }

            // Find the checkbox inside the clicked element
            let checkbox = this.querySelector('.form-check-input[type="checkbox"]');
            if (checkbox) {
                // Check if the checkbox is disabled
                if (checkbox.disabled) {
                    return; // Exit early if the checkbox is disabled
                }
                // Prevent the default behavior
                event.preventDefault();
                event.stopImmediatePropagation();

                // Toggle the checkbox state manually
                checkbox.checked = !checkbox.checked;
                // Optional: Trigger a change event if needed
                if (trigger === true) {
                    $(checkbox).trigger('change');
                }
            }
        });

        // Handle direct clicks on the checkbox itself
        $area.on('click', '.form-check-input', function (event) {
            // Prevent the default behavior to avoid double-triggering
            event.stopPropagation();
            event.stopImmediatePropagation();

            // Checkbox state is toggled naturally, so no need to modify it
            if (trigger === true) {
                $(this).trigger('change'); // Optional: Trigger change event explicitly
            }
        });

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
        NodeLoadDataHandle.loadInitS2(NodeLoadDataHandle.$boxSource, NodeLoadDataHandle.dataSource);

        NodeDataTableHandle.dataTableCollabOutFormEmployee();
        NodeDataTableHandle.$tableOFEmp.DataTable().clear().draw();
        NodeDataTableHandle.$tableOFEmp.DataTable().rows.add(JSON.parse(NodeLoadDataHandle.$initEmp.val())).draw();
        NodeDataTableHandle.dataTableCollabInWFEmployee();
        NodeDataTableHandle.dataTableCollabInWFExitCon();
        let nodeActionRaw = $('#wf_action').text();
        if (nodeActionRaw) {
            let nodeAction = JSON.parse(nodeActionRaw);
            let dataExitCon = [
                {'action': 1, 'title': nodeAction[1], 'next_node': NodeLoadDataHandle.transEle.attr('data-node-completed')},
                {'action': 2, 'title': nodeAction[2], 'next_node': NodeLoadDataHandle.transEle.attr('data-node-completed')},
                {'action': 3, 'title': nodeAction[3], 'next_node': ''},
            ]
            NodeDataTableHandle.$tableInWFExitCon.DataTable().clear().draw();
            NodeDataTableHandle.$tableInWFExitCon.DataTable().rows.add(dataExitCon).draw();
        }
        NodeDataTableHandle.$tableInWFExitCon.DataTable().rows().every(function () {
            let row = this.node();
            if (row.querySelector('.table-row-action')) {
                if (row.querySelector('.table-row-action').getAttribute('data-row')) {
                    let dataRow = JSON.parse(row.querySelector('.table-row-action').getAttribute('data-row'));
                    if ([2, 3].includes(dataRow?.['action'])) {
                        if (row.querySelector('.table-row-min-collab')) {
                            NodeLoadDataHandle.loadInitS2($(row.querySelector('.table-row-min-collab')), [
                                {'id': '', 'title': 'Select...',},
                                {'id': '1', 'title': '0',},
                                {'id': 'else', 'title': 'Else',},
                            ], {}, NodeLoadDataHandle.$modalNode);
                        }
                    }
                }
            }
        });
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

                    if (data?.['order'] === 1) {  // node initial
                        NodeLoadDataHandle.$titleNode[0].setAttribute('readonly', 'true');
                        NodeLoadDataHandle.$remarkNode[0].setAttribute('readonly', 'true');
                        NodeLoadDataHandle.$nodeSysArea[0].removeAttribute('hidden');
                        for (let eleCheck of NodeLoadDataHandle.$modalNode[0].querySelectorAll('.checkbox-action')) {
                            eleCheck.setAttribute('disabled', 'true');
                            eleCheck.checked = (parseInt(eleCheck.getAttribute('data-id')) === 0);
                        }
                        NodeLoadDataHandle.loadActionShow();
                        let editAllEle = NodeLoadDataHandle.$nodeSysArea[0].querySelector('.checkbox-zone-edit-all');
                        if (editAllEle) {
                            editAllEle.checked = data?.['is_edit_all_zone'];
                        }
                        for (let checkEle of NodeLoadDataHandle.$nodeSysArea[0].querySelectorAll('.checkbox-zone-edit')) {
                            checkEle.checked = data?.['zone_initial_node'].includes(parseInt(checkEle.getAttribute('data-id')));
                        }
                        for (let checkEle of NodeLoadDataHandle.$nodeSysArea[0].querySelectorAll('.checkbox-zone-hidden')) {
                            checkEle.checked = data?.['zone_hidden_initial_node'].includes(parseInt(checkEle.getAttribute('data-id')));
                        }
                    }

                    if (data?.['order'] !== 1) {  // node custom
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

                            let approvedVal = 0;
                            NodeDataTableHandle.$tableInWFExitCon.DataTable().rows().every(function () {
                                let row = this.node();
                                if (row.querySelector('.table-row-action') && row.querySelector('.table-row-min-collab')) {
                                    if (row.querySelector('.table-row-action').getAttribute('data-row')) {
                                        let dataRow = JSON.parse(row.querySelector('.table-row-action').getAttribute('data-row'));
                                        for (let dataCon of data?.['condition']) {
                                            if (dataRow?.['action'] === dataCon?.['action']) {
                                                if (dataRow?.['action'] === 1) {
                                                    $(row.querySelector('.table-row-min-collab')).val(dataCon?.['min_collab']);
                                                    approvedVal = dataCon?.['min_collab'];
                                                }
                                                if ([2, 3].includes(dataRow?.['action'])) {
                                                    let value = NodeDataTableHandle.$tableInWF.DataTable().data().count() + 1 - parseInt(approvedVal);
                                                    NodeLoadDataHandle.loadInitS2($(row.querySelector('.table-row-min-collab')), [
                                                        {'id': '', 'title': 'Select...',},
                                                        {'id': String(value), 'title': String(value),},
                                                        {'id': 'else', 'title': 'Else',},
                                                    ], {}, NodeLoadDataHandle.$modalNode);
                                                    $(row.querySelector('.table-row-min-collab')).val(dataCon?.['min_collab']).trigger('change');
                                                }
                                            }
                                        }
                                    }
                                }
                            });
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
                                    <input type="checkbox" class="form-check-input checkbox-action" id="action-${key}" data-id="${key}">
                                    <label class="form-check-label action-title" for="action-${key}">${nodeAction[key]}</label>
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
                            <input type="checkbox" class="form-check-input checkbox-zone-edit" id="zone-edit-${key}" data-id="${key}">
                            <label class="form-check-label zone-title" for="zone-edit-${key}">${zoneData?.[key]}</label>
                        </div>`;
            htmlHidden += `<div class="form-check form-check-lg">
                            <input type="checkbox" class="form-check-input checkbox-zone-hidden" id="zone-hidden-${key}" data-id="${key}">
                            <label class="form-check-label zone-title" for="zone-hidden-${key}">${zoneData?.[key]}</label>
                        </div>`;
        }
        for (let ele of NodeLoadDataHandle.$modalNode[0].querySelectorAll('.zone-edit')) {
            // $(ele).empty().append(`<div data-simplebar class="nicescroll-bar">${htmlEdit}</div>`);
            $(ele).empty().append(`<div data-bs-spy="scroll" data-bs-smooth-scroll="true" class="h-150p position-relative overflow-y-scroll">${htmlEdit}</div>`);
        }
        for (let ele of NodeLoadDataHandle.$modalNode[0].querySelectorAll('.zone-hidden')) {
            // $(ele).empty().append(`<div data-simplebar class="nicescroll-bar">${htmlHidden}</div>`);
            $(ele).empty().append(`<div data-bs-spy="scroll" data-bs-smooth-scroll="true" class="h-150p position-relative overflow-y-scroll">${htmlHidden}</div>`);
        }
        return true;
    };

    static loadCheckZone(ele) {
        if (ele.checked === true) {
            let sysNodeArea = ele.closest('#node-system-area');  // system node (initial node)
            if (sysNodeArea) {
                if (ele.classList.contains('checkbox-zone-edit-all')) {
                    if (sysNodeArea.querySelector(`.checkbox-zone-hidden:checked`)) {
                        ele.checked = false;
                        $.fn.notifyB({description: NodeLoadDataHandle.transEle.attr('data-valid-zone-hidden-exist')}, 'failure');
                        return false;
                    }
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
                    if (sysNodeArea.querySelector('.checkbox-zone-edit-all:checked')) {
                        ele.checked = false;
                        $.fn.notifyB({description: NodeLoadDataHandle.transEle.attr('data-valid-zone-edit-all')}, 'failure');
                        return false;
                    }
                    let dataId = ele.getAttribute('data-id');
                    if (sysNodeArea.querySelector(`.checkbox-zone-edit[data-id="${dataId}"]:checked`)) {
                        ele.checked = false;
                        $.fn.notifyB({description: NodeLoadDataHandle.transEle.attr('data-valid-zone-hidden')}, 'failure');
                        return false;
                    }
                }
            }

            let collabArea = ele.closest('.collab-area');  // custom node
            if (collabArea) {
                if (ele.classList.contains('checkbox-zone-edit-all')) {
                    if (collabArea.querySelector(`.checkbox-zone-hidden:checked`)) {
                        ele.checked = false;
                        $.fn.notifyB({description: NodeLoadDataHandle.transEle.attr('data-valid-zone-hidden-exist')}, 'failure');
                        return false;
                    }
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
                    if (collabArea.querySelector('.checkbox-zone-edit-all:checked')) {
                        ele.checked = false;
                        $.fn.notifyB({description: NodeLoadDataHandle.transEle.attr('data-valid-zone-edit-all')}, 'failure');
                        return false;
                    }
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

    static loadExitConDefault() {
        let approvedVal = 0;
        let rejectedVal = 0;
        if (NodeDataTableHandle.$tableInWF.DataTable().data().count() === 0) {
            approvedVal = 0;
            rejectedVal = 0;
        }
        if (NodeDataTableHandle.$tableInWF.DataTable().data().count() > 0) {
            approvedVal = NodeDataTableHandle.$tableInWF.DataTable().data().count();
            rejectedVal = NodeDataTableHandle.$tableInWF.DataTable().data().count() + 1 - NodeDataTableHandle.$tableInWF.DataTable().data().count();
        }
        NodeDataTableHandle.$tableInWFExitCon.DataTable().rows().every(function () {
            let row = this.node();
            if (row.querySelector('.table-row-action') && row.querySelector('.table-row-min-collab')) {
                if (row.querySelector('.table-row-action').getAttribute('data-row')) {
                    let dataRow = JSON.parse(row.querySelector('.table-row-action').getAttribute('data-row'));
                    if (dataRow?.['action'] === 1) {
                        $(row.querySelector('.table-row-min-collab')).val(String(approvedVal)).trigger('change');
                    }
                }
            }
        });
        NodeDataTableHandle.$tableInWFExitCon.DataTable().rows().every(function () {
            let row = this.node();
            if (row.querySelector('.table-row-action') && row.querySelector('.table-row-min-collab')) {
                if (row.querySelector('.table-row-action').getAttribute('data-row')) {
                    let dataRow = JSON.parse(row.querySelector('.table-row-action').getAttribute('data-row'));
                    if (dataRow?.['action'] === 2) {
                        $(row.querySelector('.table-row-min-collab')).val(String(rejectedVal)).trigger('change');
                    }
                }
            }
        });
        return true;
    }

    static loadChangeExitCon(ele) {
        if (ele.closest('tr')) {
            if (ele.closest('tr').querySelector('.table-row-action')) {
                if (ele.closest('tr').querySelector('.table-row-action').getAttribute('data-row')) {
                    let dataRow = JSON.parse(ele.closest('tr').querySelector('.table-row-action').getAttribute('data-row'));
                    if (dataRow?.['action'] === 1) {
                        NodeLoadDataHandle.loadChangeExitConApproved(ele);
                    }
                    if ([2, 3].includes(dataRow?.['action'])) {
                        NodeLoadDataHandle.loadChangeExitConElse(ele, dataRow?.['action']);
                    }
                }
            }
        }
        return true;
    };

    static loadChangeExitConApproved(ele) {
        if (parseInt($(ele).val()) <= NodeDataTableHandle.$tableInWF.DataTable().data().count()) {
            NodeDataTableHandle.$tableInWFExitCon.DataTable().rows().every(function () {
                let row = this.node();
                if (row.querySelector('.table-row-action') && row.querySelector('.table-row-min-collab')) {
                    if (row.querySelector('.table-row-action').getAttribute('data-row')) {
                        let dataRow = JSON.parse(row.querySelector('.table-row-action').getAttribute('data-row'));
                        if ([2, 3].includes(dataRow?.['action'])) {
                            let value = NodeDataTableHandle.$tableInWF.DataTable().data().count() + 1 - parseInt($(ele).val());
                            NodeLoadDataHandle.loadInitS2($(row.querySelector('.table-row-min-collab')), [
                                {'id': '', 'title': 'Select...',},
                                {'id': String(value), 'title': String(value),},
                                {'id': 'else', 'title': 'Else',},
                            ], {}, NodeLoadDataHandle.$modalNode);
                        }
                    }
                }
            });
        } else {
            ele.value = '0';
            $.fn.notifyB({description: NodeLoadDataHandle.transEle.attr('data-exceed-collab')}, 'failure');
            return false;
        }
        return true;
    };

    static loadChangeExitConElse(ele, actionType) {
        if (parseInt($(ele).val()) <= NodeDataTableHandle.$tableInWF.DataTable().data().count()) {
            NodeDataTableHandle.$tableInWFExitCon.DataTable().rows().every(function () {
                let row = this.node();
                if (row.querySelector('.table-row-action') && row.querySelector('.table-row-min-collab')) {
                    if (row.querySelector('.table-row-action').getAttribute('data-row')) {
                        let dataRow = JSON.parse(row.querySelector('.table-row-action').getAttribute('data-row'));
                        if ([2, 3].includes(dataRow?.['action'])) {
                            if (dataRow?.['action'] !== actionType) {
                                if ($(ele).val() !== 'else') {
                                    $(row.querySelector('.table-row-min-collab')).val('else').trigger('change');
                                } else {

                                }
                            }
                        }
                    }
                }
            });
        }
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
                        return `<div class="form-check form-check-lg">
                                        <input
                                            type="checkbox" 
                                            class="form-check-input table-row-checkbox"
                                            data-id="${row?.['id']}"
                                            data-title="${row?.['full_name']}"
                                            data-row="${dataRow}"
                                            ${checked}
                                        >
                                        <span class="badge badge-primary mr-2 table-row-code">${row?.['code']}</span>
                                        <span class="badge badge-primary badge-outline table-row-title">${row?.['full_name']}</span>
                                    </div>`;
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<span class="badge badge-light badge-outline">${row?.['group']?.['title'] ? row?.['group']?.['title'] : ''}</span>`;
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        if (row.hasOwnProperty('role') && Array.isArray(row?.['role'])) {
                            let result = [];
                            row?.['role'].map(item => item?.['title'] ? result.push(`<span class="badge badge-light badge-outline mb-1 mr-1">` + item?.['title'] + `</span>`) : null);
                            return result.join(" ");
                        }
                        return '';
                    }
                },
            ],
            drawCallback: function () {
                NodeLoadDataHandle.loadEventCheckbox(NodeDataTableHandle.$tableOFEmp);
            },
        });
    };

    static dataTableCollabInWFEmployee(data) {
        NodeDataTableHandle.$tableInWF.not('.dataTable').DataTableDefault({
            data: data ? data : [],
            ordering: false,
            paginate: false,
            info: false,
            searching: false,
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
                                    dataEmp?.['role'].map(item => item?.['title'] ? result.push(`<span class="badge badge-light badge-outline mb-1 mr-1">${item?.['title']}</span>`) : null);
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
                                    <button type="button" class="btn btn-icon btn-rounded btn-rounded btn-flush-light flush-soft-hover del-row"><span class="icon"><i class="fa-regular fa-trash-can"></i></span></button>
                                </div>`;
                    }
                },
            ],
            drawCallback: function () {
                // load change exit condition default
                NodeLoadDataHandle.loadExitConDefault();
                if (['post', 'put'].includes(NodeLoadDataHandle.$form.attr('data-method').toLowerCase())) {
                    NodeDataTableHandle.dtbInWFEmployeeHDCustom();
                }
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
                        return `<b class="table-row-action" data-row="${dataRow}">${row?.['title']}</b>`;
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        if (row?.['action'] === 1) {
                            return `<input type="text" class="form-control table-row-min-collab validated-number" value="${row?.['min_collab'] ? row?.['min_collab'] : 0}">`;
                        }
                        return `<select class="form-select table-row-min-collab"></select>`;
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<p class="table-row-next-node">${row?.['next_node']} (${row?.['title']})</p>`;
                    }
                },
            ],
            drawCallback: function () {
                // add css to Dtb
                NodeLoadDataHandle.loadCssToDtb(NodeDataTableHandle.$tableInWFExitCon[0].id);
            },
        });
    };

    // Custom dtb
    static dtbInWFEmployeeHDCustom() {
        let $table = NodeDataTableHandle.$tableInWF;
        let wrapper$ = $table.closest('.dataTables_wrapper');
        let headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
        let textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
        headerToolbar$.prepend(textFilter$);

        if (textFilter$.length > 0) {
            textFilter$.css('display', 'flex');
            // Check if the button already exists before appending
            if (!$('#btn-add-collab-in-wf').length) {
                let $group = $(`<button
                                        type="button"
                                        class="btn btn-outline-secondary"
                                        data-bs-toggle="offcanvas"
                                        data-bs-target="#inWFCanvas"
                                        aria-controls="inWFCanvas"
                                        id="btn-add-collab-in-wf"
                                >
                                    <span><span class="icon"><i class="fa-solid fa-plus"></i></span><span>${NodeLoadDataHandle.transEle.attr('data-add-new')}</span></span>
                                </button>`);
                textFilter$.append(
                    $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append($group)
                );
            }
        }
    };

}

// Store data
class NodeStoreHandle {
    static storeNode() {
        let initLength = NodeLoadDataHandle.dataNode.length;

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
                            if (NodeLoadDataHandle.dataNode[i]?.['order'] === 1) {  // initial node
                                if (data?.['actions']) {
                                    NodeLoadDataHandle.dataNode[i]['actions'] = data?.['actions'];
                                    NodeLoadDataHandle.dataNode[i]['is_edit_all_zone'] = data?.['is_edit_all_zone'];
                                    NodeLoadDataHandle.dataNode[i]['zone_initial_node'] = data?.['zone_initial_node'];
                                    NodeLoadDataHandle.dataNode[i]['zone_hidden_initial_node'] = data?.['zone_hidden_initial_node'];
                                }
                            }
                            if (NodeLoadDataHandle.dataNode[i]?.['order'] > 1) {  // custom node
                                // check collab
                                let checkCollab = NodeStoreHandle.storeCheckCollab(data, NodeLoadDataHandle.dataNode[i]?.['order']);
                                if (checkCollab === false) {
                                    $.fn.notifyB({description: NodeLoadDataHandle.transEle.attr('data-check-collab')}, 'failure');
                                    return false;
                                }

                                let isEditTitle = false;
                                if (NodeLoadDataHandle.dataNode[i]?.['title'] !== data?.['title']) {
                                    isEditTitle = true;
                                }
                                NodeLoadDataHandle.dataNode[i] = data;
                                NodeLoadDataHandle.dataNode[i]['order'] = parseInt(NodeLoadDataHandle.$btnSaveNode[0].getAttribute('data-order'));

                                // if edit title then change node's title in left & right of flowchart
                                if (isEditTitle === true) {
                                    let control = NodeLoadDataHandle.$nodeDragBox[0].querySelector(`.control[data-drag="${NodeLoadDataHandle.dataNode[i]['order']}"]`);
                                    if (control) {
                                        if (control.querySelector('.drag-title')) {
                                            control.querySelector('.drag-title').innerHTML = NodeLoadDataHandle.dataNode[i]['title'];
                                        }
                                    }
                                    let clone = NodeLoadDataHandle.$flowChart[0].querySelector(`.clone[data-drag="${NodeLoadDataHandle.dataNode[i]['order']}"]`);
                                    if (clone) {
                                        if (clone.querySelector('.drag-title')) {
                                            clone.querySelector('.drag-title').innerHTML = NodeLoadDataHandle.dataNode[i]['title'];
                                        }
                                    }
                                }
                            }
                            break;
                        }
                    }
                }
            }
            if (NodeLoadDataHandle.dataNode.length !== initLength) {
                FlowJsP.init();
            }
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
            if (NodeLoadDataHandle.$btnSaveNode[0].getAttribute('data-order') === "1") {
                dataStore['is_edit_all_zone'] = !!NodeLoadDataHandle.$nodeSysArea[0].querySelector('.checkbox-zone-edit-all:checked');
                let zone = [];
                for (let eleChecked of NodeLoadDataHandle.$nodeSysArea[0].querySelectorAll('.checkbox-zone-edit:checked')) {
                    if (eleChecked.getAttribute('data-id')) {
                        zone.push(parseInt(eleChecked.getAttribute('data-id')));
                    }
                }
                dataStore['zone_initial_node'] = zone;
                let zoneHidden = [];
                for (let eleChecked of NodeLoadDataHandle.$nodeSysArea[0].querySelectorAll('.checkbox-zone-hidden:checked')) {
                    if (eleChecked.getAttribute('data-id')) {
                        zoneHidden.push(parseInt(eleChecked.getAttribute('data-id')));
                    }
                }
                dataStore['zone_hidden_initial_node'] = zoneHidden;
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
            dataStore['condition'] = [];
            NodeDataTableHandle.$tableInWF.DataTable().rows().every(function () {
                let row = this.node();
                if (row.querySelector('.table-row-title')) {
                    if (row.querySelector('.table-row-title').getAttribute('data-row')) {
                        let dataRow = JSON.parse(row.querySelector('.table-row-title').getAttribute('data-row'));
                        dataStore['collab_in_workflow'].push(dataRow);
                    }
                }
            });
            NodeDataTableHandle.$tableInWFExitCon.DataTable().rows().every(function () {
                let row = this.node();
                if (row.querySelector('.table-row-action') && row.querySelector('.table-row-min-collab')) {
                    if (row.querySelector('.table-row-action').getAttribute('data-row')) {
                        let dataRow = JSON.parse(row.querySelector('.table-row-action').getAttribute('data-row'));
                        dataRow['min_collab'] = $(row.querySelector('.table-row-min-collab')).val();
                        dataStore['condition'].push(dataRow);
                    }
                }
            });
        }
        dataStore['is_system'] = false;
        return dataStore;
    };

    static storeCheckCollab(data, orderCheck) {
        if (data?.['option_collaborator'] === 1 && data?.['collab_out_form']) {  // out form
            if (data?.['collab_out_form']?.['employee_list']) {
                if (data?.['collab_out_form']?.['employee_list'].length > 1) {
                    let $eleAssociate = $('#node-associate');
                    if ($eleAssociate.val()) {
                        let associate = JSON.parse($eleAssociate.val());
                        for (let key in associate) {
                            if (associate[key]?.['node_out'] === orderCheck) {
                                for (let dataNode of NodeLoadDataHandle.dataNode) {
                                    if (associate[key]?.['node_in'] === dataNode?.['order']) {
                                        if (dataNode?.['option_collaborator'] === 2) {
                                            if (dataNode?.['collab_in_workflow']) {
                                                if (dataNode?.['collab_in_workflow'].length > 1) {
                                                    return false;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if (data?.['option_collaborator'] === 2 && data?.['collab_in_workflow']) {  // in workflow
            if (data?.['collab_in_workflow'].length > 1) {
                let $eleAssociate = $('#node-associate');
                if ($eleAssociate.val()) {
                    let associate = JSON.parse($eleAssociate.val());
                    for (let key in associate) {
                        if (associate[key]?.['node_in'] === orderCheck) {
                            for (let dataNode of NodeLoadDataHandle.dataNode) {
                                if (associate[key]?.['node_out'] === dataNode?.['order']) {
                                    if (dataNode?.['option_collaborator'] === 1) {
                                        if (dataNode?.['collab_out_form']) {
                                            if (dataNode?.['collab_out_form']?.['employee_list']) {
                                                if (dataNode?.['collab_out_form']?.['employee_list'].length > 1) {
                                                    return false;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return true;
    };

}

// Submit Form
class NodeSubmitHandle {

    static setupDataFlowChart() {
        return NodeLoadDataHandle.dataNode;
    };

    static setupDataSubmit() {
        for (let node of NodeLoadDataHandle.dataNode) {
            let txt = NodeLoadDataHandle.transEle.attr('data-complete-node') + " (" + node?.['title'] + ")";
            if (node?.['title'] === "") {
                $.fn.notifyB({description: txt}, 'failure');
                return false;
            }
            if (node?.['is_system'] === false) {
                if (node?.['actions'].length <= 0) {
                    $.fn.notifyB({description: txt}, 'failure');
                    return false;
                }
                if (node?.['option_collaborator'] === 1) {
                    if (node?.['collab_out_form']?.['employee_list']) {
                        if (node?.['collab_out_form']?.['employee_list'].length <= 0) {
                            $.fn.notifyB({description: txt}, 'failure');
                            return false;
                        }
                    } else {
                        $.fn.notifyB({description: txt}, 'failure');
                        return false;
                    }
                }
                if (node?.['option_collaborator'] === 2) {
                    if (node?.['collab_in_workflow'].length <= 0) {
                        $.fn.notifyB({description: txt}, 'failure');
                        return false;
                    }
                }
            }
        }
        return NodeLoadDataHandle.dataNode;
    };

}

// COMMON FUNCTION
function filterFieldList(field_list, data_json) {
    for (let key in data_json) {
        if (!field_list.includes(key)) delete data_json[key]
    }
    return data_json;
}

function delWFNodeRowTable(currentRow, $table) {
    // Get the index of the current row within the DataTable
    let rowIndex = $table.DataTable().row(currentRow).index();
    let row = $table.DataTable().row(rowIndex);
    // Delete current row
    row.remove().draw();
}
