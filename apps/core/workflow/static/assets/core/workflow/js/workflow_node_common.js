// LoadData
class NodeLoadDataHandle {
    static $form = $('#form-create_workflow');
    static $boxApp = $("#select-box-features");

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
    static $modalCondition = $('#conditionModal');
    static $btnSaveCondition = $('#btn-save-condition');


    static transEle = $('#node-trans-factory');
    static $urlsEle = $('#app-url-factory');
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
        // {
        //     'title': NodeLoadDataHandle.transEle.attr('data-node-completed'),
        //     'code': 'completed',
        //     'code_node_system': 'completed',
        //     'is_system': true,
        //     'order': 3,
        // }
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

    static $OFEmpCheckedEle = $('#of-employee-checked');

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

    static loadInit() {
        NodeFormulaHandle.loadPropertyMD();
        NodeFormulaHandle.loadFunctionMD();
    };

    static loadModalNode() {
        NodeLoadDataHandle.loadDDAction();
        NodeLoadDataHandle.loadActionShow();
        NodeLoadDataHandle.loadZone();
        FormElementControl.loadInitS2(NodeLoadDataHandle.$boxSource, NodeLoadDataHandle.dataSource);

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
                            FormElementControl.loadInitS2($(row.querySelector('.table-row-min-collab')), [
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
                                    WindowControl.showLoading();
                                    $.fn.callAjax2({
                                            'url': NodeLoadDataHandle.$initEmp.attr('data-url'),
                                            'method': 'GET',
                                            'data': {'id__in': data?.['collab_out_form']?.['employee_list'].join(',')},
                                            'isDropdown': true,
                                        }
                                    ).then(
                                        (resp) => {
                                            let dataRes = $.fn.switcherResp(resp);
                                            if (dataRes) {
                                                if (dataRes.hasOwnProperty('employee_list') && Array.isArray(dataRes.employee_list)) {
                                                    let storeData = {};
                                                    for (let OFEmpData of dataRes?.['employee_list']) {
                                                        storeData[OFEmpData?.['id']] = {'data': OFEmpData};
                                                    }
                                                    NodeLoadDataHandle.$OFEmpCheckedEle.val(JSON.stringify(storeData));
                                                    NodeLoadDataHandle.loadOFEmpShow();
                                                    WindowControl.hideLoading();
                                                }
                                            }
                                        }
                                    )
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
                                                    FormElementControl.loadInitS2($(row.querySelector('.table-row-min-collab')), [
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
        FormElementControl.loadInitS2(NodeLoadDataHandle.$boxInWFOpt, NodeLoadDataHandle.dataInWFOption, {}, $canvas);
        FormElementControl.loadInitS2(NodeLoadDataHandle.$boxInWFPos, NodeLoadDataHandle.dataInWFPosition, {}, $canvas);
        FormElementControl.loadInitS2(NodeLoadDataHandle.$boxInWFEmp, [], {}, $canvas);
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
                        htmlShow += `<div class="chip chip-outline-secondary bg-white mr-1 mb-1">
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
            let titleEle = row.querySelector('.table-row-title');
            if (titleEle) {
                result[i] = titleEle.innerHTML;
            }
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
    static loadStoreCheckOFEmployee(ele) {
        let row = ele.closest('tr');
        let rowIndex = NodeDataTableHandle.$tableOFEmp.DataTable().row(row).index();
        let $row = NodeDataTableHandle.$tableOFEmp.DataTable().row(rowIndex);
        let dataRow = $row.data();

        if (dataRow) {
            if (NodeLoadDataHandle.$OFEmpCheckedEle.val()) {
                let storeID = JSON.parse(NodeLoadDataHandle.$OFEmpCheckedEle.val());
                if (typeof storeID === 'object') {
                    if (ele.checked === true) {
                        if (!storeID?.[dataRow?.['id']]) {
                            storeID[dataRow?.['id']] = {
                                "type": "current",
                                "data": dataRow,
                            };
                        }
                    }
                    if (ele.checked === false) {
                        if (storeID?.[dataRow?.['id']]) {
                            delete storeID?.[dataRow?.['id']];
                        }
                    }
                    NodeLoadDataHandle.$OFEmpCheckedEle.val(JSON.stringify(storeID));
                }
            } else {
                let dataStore = {};
                if (ele.checked === true) {
                    dataStore[dataRow?.['id']] = {
                        "type": "current",
                        "data": dataRow,
                    };
                }
                NodeLoadDataHandle.$OFEmpCheckedEle.val(JSON.stringify(dataStore));
            }
        }
        return true;
    };

    static loadOFEmpShow() {
        if (NodeLoadDataHandle.$modalNode[0].querySelector('.out-form-emp-show')) {
            let $ele = $(NodeLoadDataHandle.$modalNode[0].querySelector('.out-form-emp-show'));
            let htmlShow = ``;
            if (NodeLoadDataHandle.$OFEmpCheckedEle.val()) {
                let storeID = JSON.parse(NodeLoadDataHandle.$OFEmpCheckedEle.val());
                for (let key in storeID) {
                    let dataAdd = storeID[key]?.['data'];
                    htmlShow += `<div class="chip chip-outline-secondary chip-wth-icon bg-white mr-1 mb-1 out-form-emp-show" data-id="${dataAdd?.['id']}">
                                        <span><i class="fas fa-user-circle"></i><span class="chip-text">${dataAdd?.['full_name']}</span></span>
                                    </div>`;
                }
            }
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
        let row = ele.closest('tr');
        if (row) {
            let actionEle = row.querySelector('.table-row-action');
            if (actionEle) {
                if (actionEle.getAttribute('data-row')) {
                    let dataRow = JSON.parse(actionEle.getAttribute('data-row'));
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
                let actionEle = row.querySelector('.table-row-action');
                let minCollabEle = row.querySelector('.table-row-min-collab');
                if (actionEle && minCollabEle) {
                    if (actionEle.getAttribute('data-row')) {
                        let dataRow = JSON.parse(actionEle.getAttribute('data-row'));
                        if ([2, 3].includes(dataRow?.['action'])) {
                            let value = NodeDataTableHandle.$tableInWF.DataTable().data().count() + 1 - parseInt($(ele).val());
                            FormElementControl.loadInitS2($(minCollabEle), [
                                {'id': '', 'title': 'Select...',},
                                {'id': String(value), 'title': String(value),},
                                {'id': 'else', 'title': 'Else',},
                            ], {}, NodeLoadDataHandle.$modalNode);
                            if (dataRow?.['action'] === 2) {
                                $(minCollabEle).val(String(value)).trigger('change');
                            }
                            if (dataRow?.['action'] === 3) {
                                $(minCollabEle).val('else').trigger('change');
                            }
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
                let actionEle = row.querySelector('.table-row-action');
                let minCollabEle = row.querySelector('.table-row-min-collab');
                if (actionEle && minCollabEle) {
                    if (actionEle.getAttribute('data-row')) {
                        let dataRow = JSON.parse(actionEle.getAttribute('data-row'));
                        if ([2, 3].includes(dataRow?.['action'])) {
                            if (dataRow?.['action'] !== actionType) {
                                if ($(ele).val() !== 'else') {
                                    $(minCollabEle).val('else').trigger('change');
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
        data = data.filter(item => !(item?.['is_system'] === true && item?.['code_node_system'] === "completed"));
        NodeLoadDataHandle.dataNode = data;
        NodeLoadDataHandle.loadModalNode();

        // FlowJsP.init();
    };

    // delete
    static loadDeleteNode(target) {
        NodeLoadDataHandle.dataNode = NodeLoadDataHandle.dataNode.filter(data => data.order !== target);
        FlowJsP.init(true);
        $('#node-associate').val("");
    };

}

// DataTable
class NodeDataTableHandle {
    static $tableOFEmp = $('#table-out-form-employee');
    static $tableInWF = $('#table-in-workflow');
    static $tableInWFExitCon = $('#table-in-workflow-exit-condition');

    static dataTableCollabOutFormEmployee() {
        if ($.fn.dataTable.isDataTable(NodeDataTableHandle.$tableOFEmp)) {
            NodeDataTableHandle.$tableOFEmp.DataTable().destroy();
        }
        NodeDataTableHandle.$tableOFEmp.DataTableDefault({
            useDataServer: true,
            ajax: {
                url: NodeLoadDataHandle.$initEmp.attr('data-url'),
                type: "GET",
                data: {
                    "ordering": 'code'
                },
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('employee_list')) return data.employee_list;
                    }
                    return [];
                }
            },
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        let checked = '';
                        if (NodeLoadDataHandle.$OFEmpCheckedEle.val()) {
                            let storeID = JSON.parse(NodeLoadDataHandle.$OFEmpCheckedEle.val());
                            if (typeof storeID === 'object') {
                                if (storeID?.[row?.['id']]) {
                                    checked = 'checked';
                                }
                            }
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
                                    </div>`;
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<span class="table-row-code">${row?.['code']}</span>`;
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<span class="table-row-title">${row?.['full_name']}</span>`;
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        return `<span>${row?.['group']?.['title'] ? row?.['group']?.['title'] : ''}</span>`;
                    }
                },
                {
                    targets: 4,
                    width: '25%',
                    render: (data, type, row) => {
                        if (row.hasOwnProperty('role') && Array.isArray(row?.['role'])) {
                            let result = [];
                            row?.['role'].map(item => item?.['title'] ? result.push(`<span>` + item?.['title'] + `</span>`) : null);
                            return result.join(", ");
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
                                return `<span class="mr-2"><i class="fas fa-user-circle"></i></span><span class="table-row-title" data-row="${dataRow}">${dataEmp?.['full_name'] ? dataEmp?.['full_name'] : ''}</span>`;
                            }
                        }
                        if (row?.['position_choice']) {
                            for (let dataPos of NodeLoadDataHandle.dataInWFPosition) {
                                if (dataPos?.['id'] === row?.['position_choice']) {
                                    return `<span class="mr-2"><i class="fas fa-sitemap"></i></span><span class="table-row-title" data-row="${dataRow}">${dataPos?.['title']}</span>`;
                                }
                            }
                        }
                        return ``;
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return '<div class="table-row-role"></div>';
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
            rowCallback: function (row, data, index) {
                let titleEle = row.querySelector('.table-row-title');
                let roleEle = row.querySelector('.table-row-role');
                if (titleEle && roleEle) {
                    if (data?.['employee']) {
                        WindowControl.showLoading();
                        $.fn.callAjax2({
                                'url': NodeLoadDataHandle.$boxInWFEmp.attr('data-url'),
                                'method': "GET",
                                'data': {'id': data?.['employee']},
                                'isDropdown': true,
                            }
                        ).then(
                            (resp) => {
                                let data = $.fn.switcherResp(resp);
                                if (data) {
                                    if (data.hasOwnProperty('employee_list') && Array.isArray(data.employee_list)) {
                                        if (data?.['employee_list'].length === 1) {
                                            let dataEmp = data?.['employee_list'][0];
                                            titleEle.innerHTML = dataEmp?.['full_name'];
                                            if (dataEmp.hasOwnProperty('role') && Array.isArray(dataEmp?.['role'])) {
                                                let result = [];
                                                dataEmp?.['role'].map(item => item?.['title'] ? result.push(`<span class="badge badge-light badge-outline mb-1 mr-1">${item?.['title']}</span>`) : null);
                                                roleEle.innerHTML = result.join(" ");
                                            }
                                        }
                                        WindowControl.hideLoading();
                                    }
                                }
                            }
                        )
                    }
                }
            },
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
        if ($.fn.dataTable.isDataTable(NodeDataTableHandle.$tableInWFExitCon)) {
            NodeDataTableHandle.$tableInWFExitCon.DataTable().destroy();
        }
        NodeDataTableHandle.$tableInWFExitCon.DataTableDefault({
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
                            return `<input type="text" class="form-control table-row-min-collab valid-num" value="${row?.['min_collab'] ? row?.['min_collab'] : 0}">`;
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
        let $theadEle = wrapper$.find('thead');
        if ($theadEle.length > 0) {
            for (let thEle of $theadEle[0].querySelectorAll('th')) {
                if (!$(thEle).hasClass('border-right')) {
                    $(thEle).addClass('border-right');
                }
            }
        }
        let headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
        let textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
        headerToolbar$.prepend(textFilter$);

        if (textFilter$.length > 0) {
            textFilter$.css('display', 'flex');
            // Check if the button already exists before appending
            if (!$('#btn-add-collab-in-wf').length) {
                let $group = $(`<button
                                        type="button"
                                        class="btn btn-primary"
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
                if (NodeLoadDataHandle.dataNode.length >= 2) {
                    // NodeLoadDataHandle.dataNode.splice(-2, 2);
                    NodeLoadDataHandle.dataNode.pop();
                }
                newData['order'] = NodeLoadDataHandle.dataNode.length + 1;
                NodeLoadDataHandle.dataNode.push(newData);
                NodeLoadDataHandle.dataSystemNodeApproved['order'] = NodeLoadDataHandle.dataNode.length + 1;
                // NodeLoadDataHandle.dataSystemNodeCompleted['order'] = NodeLoadDataHandle.dataNode.length + 2;
                NodeLoadDataHandle.dataNode.push(NodeLoadDataHandle.dataSystemNodeApproved);
                // NodeLoadDataHandle.dataNode.push(NodeLoadDataHandle.dataSystemNodeCompleted);
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
                FlowJsP.init(true);
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

// Formula
class NodeFormulaHandle {
    static $formulaCanvas = $('#formulaCanvas');
    static $formulaEditor = $('#formula_editor');
    static $propertyMD = $('#property_md');
    static $propertyRemark = $('#property_remark');
    static $functionMD = $('#function_md');
    static $functionRemark = $('#function_remark');
    static $formulaValidateTxt = $('#formula_validate_txt');
    static $btnSaveFormula = $('#btn-save-formula');

    static appMapMDUrls = {
        "hr.employee": {
            "url": NodeLoadDataHandle.$urlsEle.attr('data-md-employee'),
            "keyResp": "employee_list",
            "keyText": "full_name",
        },
        "saledata.account": {
            "url": NodeLoadDataHandle.$urlsEle.attr('data-md-account'),
            "keyResp": "account_list",
            "keyText": "name",
        },
        "saledata.product": {
            "url": NodeLoadDataHandle.$urlsEle.attr('data-md-product'),
            "keyResp": "product_sale_list",
        },
        "saledata.producttype": {
            "url": NodeLoadDataHandle.$urlsEle.attr('data-md-product-type'),
            "keyResp": "product_type_list",
        },
        "saledata.productcategory": {
            "url": NodeLoadDataHandle.$urlsEle.attr('data-md-product-category'),
            "keyResp": "product_category_list",
        },
        "saledata.expense": {
            "url": NodeLoadDataHandle.$urlsEle.attr('data-md-expense'),
            "keyResp": "expense_list",
        },
        "saledata.expenseitem": {
            "url": NodeLoadDataHandle.$urlsEle.attr('data-md-expense-item'),
            "keyResp": "expense_item_list",
        },
        "base.city": {
            "url": NodeLoadDataHandle.$urlsEle.attr('data-md-city'),
            "keyResp": "cities",
        },
    }

    // static main_regex = /[a-zA-Z]+\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)|[a-zA-Z]+|[-+*/()]|\d+|%/g;
    static main_regex = /[a-zA-Z]+\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)|[a-zA-Z]+|[-+*/()]|\d+(?:\.\d+)?|%/g;
    /*
    This main_regex parts are:
    function calls with nested parentheses
    any plain word or variable
    numbers, including decimals
    any single operator or parenthesis: +, -, *, /, (, ).
    */
    static body_nested_regex = /\((.*)\)/;
    static main_body_regex = /[a-zA-Z]+\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)|[a-zA-Z]+|[-+*/()]|\d+|".*?"|==|!=|>=|<=|>|</g;

    static loadPropertyMD() {
        NodeFormulaHandle.$propertyMD.empty();
        $.fn.callAjax2({
                'url': NodeLoadDataHandle.$urlsEle.attr('data-md-property'),
                'method': "GET",
                'data': {
                    'application_id': NodeLoadDataHandle.$boxApp.val(),
                    'is_wf_condition': true,
                },
                'isDropdown': true,
            }
        ).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('application_property_list') && Array.isArray(data.application_property_list)) {
                        let dataTrue = JSON.stringify({ 'is_property': false, 'title': 'true', 'code': 'true', 'syntax': 'true', 'syntax_show': 'true' }).replace(/"/g, "&quot;");
                        let dataFalse = JSON.stringify({ 'is_property': false, 'title': 'false', 'code': 'false', 'syntax': 'false', 'syntax_show': 'false' }).replace(/"/g, "&quot;");
                        let param_list = `<div class="row param-item mb-2">
                                                <button type="button" class="btn btn-flush-light">
                                                    <div class="float-left">
                                                        <div class="d-flex justify-content-between">
                                                            <span><span class="icon mr-2"><span class="feather-icon"><i class="fa-solid fa-hashtag"></i></span></span><span class="property-title mr-2">true</span></span>
                                                        </div>
                                                    </div>
                                                    <input type="hidden" class="data-show" value="${dataTrue}">
                                                </button>
                                            </div>
                                            <div class="row param-item mb-2">
                                                <button type="button" class="btn btn-flush-light">
                                                    <div class="float-left">
                                                        <div class="d-flex justify-content-between">
                                                            <span><span class="icon mr-2"><span class="feather-icon"><i class="fa-solid fa-hashtag"></i></span></span><span class="property-title mr-2">false</span></span>
                                                        </div>
                                                    </div>
                                                    <input type="hidden" class="data-show" value="${dataFalse}">
                                                </button>
                                            </div>`;
                        data.application_property_list.map(function (item) {
                            item['is_property'] = true;
                            item['syntax'] = "prop(" + item.title + ")";
                            item['syntax_show'] = "prop(" + item.title + ")";
                            let dataStr = JSON.stringify(item).replace(/"/g, "&quot;");
                            let iconMD = ``;
                            if (item?.['type'] === 5) {
                                iconMD = `<span class="icon"><span class="feather-icon"><i class="fas fa-database"></i></span></span>`;
                            }
                            param_list += `<div class="row param-item mb-2">
                                                        <button type="button" class="btn btn-flush-light">
                                                            <div class="float-left">
                                                                <div class="d-flex justify-content-between">
                                                                    <span><span class="icon mr-2"><span class="feather-icon"><i class="fa-solid fa-hashtag"></i></span></span><span class="property-title mr-2">${item?.['title_i18n']}</span>${iconMD}</span>
                                                                </div>
                                                            </div>
                                                            <input type="hidden" class="data-show" value="${dataStr}">
                                                        </button>
                                                    </div>`;
                        })
                        NodeFormulaHandle.$propertyMD.append(`<div data-bs-spy="scroll" data-bs-target="#scrollspy_demo_h" data-bs-smooth-scroll="true" class="h-380p position-relative overflow-y-scroll">
                                            ${param_list}
                                        </div>`);
                    }
                }
            }
        )
        return true;
    };

    static loadFunctionMD() {
        NodeFormulaHandle.$functionMD.empty();
        $.fn.callAjax2({
                'url': NodeLoadDataHandle.$urlsEle.attr('data-md-function'),
                'method': "GET",
                'data': {'param_type': 2},
                'isDropdown': true,
            }
        ).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('indicator_param') && Array.isArray(data.indicator_param)) {
                        let param_list = ``;
                        data.indicator_param.map(function (item) {
                            let dataStr = JSON.stringify(item).replace(/"/g, "&quot;");
                            param_list += `<div class="row param-item mb-2">
                                                <button type="button" class="btn btn-flush-light">
                                                    <div class="float-left"><span><span class="icon mr-2"><span class="feather-icon"><i class="fa-solid fa-hashtag"></i></span></span><span class="property-title">${item.title}</span></span></div>
                                                    <input type="hidden" class="data-show" value="${dataStr}">
                                                </button>
                                            </div>`
                        })
                        NodeFormulaHandle.$functionMD.append(`<div data-bs-spy="scroll" data-bs-target="#scrollspy_demo_h" data-bs-smooth-scroll="true" class="h-380p position-relative overflow-y-scroll">
                                            ${param_list}
                                        </div>`);
                    }
                }
            }
        )
        return true;
    };

    static mouseenterParam(ele) {
        let dataEle = ele.querySelector('.data-show');
        if (dataEle) {
            if ($(dataEle).val()) {
                let data = JSON.parse($(dataEle).val());
                let dataStr = JSON.stringify(data);
                let htmlBase = `<div data-bs-spy="scroll" data-bs-target="#scrollspy_demo_h" data-bs-smooth-scroll="true" class="h-380p position-relative overflow-y-scroll">
                                        <div class="row">
                                            <h5>${data?.['title_i18n'] ? data?.['title_i18n'] : ''}</h5>
                                            <p>${data?.['remark'] ? data?.['remark'] : ''}</p>
                                        </div>
                                        <div class="row area-property-md hidden">
                                            <div class="form-group">
                                                <select class="form-select box-property-md"></select>
                                            </div>
                                        </div>
                                        <br>
                                        <div class="row">
                                            <b>${NodeLoadDataHandle.transEle.attr('data-syntax')}</b>
                                            <p>${data?.['syntax_show'] ? data?.['syntax_show'] : ''}</p>
                                        </div>
                                        <div class="row">
                                            <b>${NodeLoadDataHandle.transEle.attr('data-example')}</b>
                                            <p>${data?.['example'] ? data?.['example'] : ''}</p>
                                        </div>
                                    </div>`;

                let tabEle = ele.closest('.tab-pane');
                if (tabEle) {
                    if (tabEle.id === "tab_formula_property") {
                        NodeFormulaHandle.$propertyRemark.empty();
                        NodeFormulaHandle.$propertyRemark.append(htmlBase);
                        if (data?.['type'] === 5) {
                            let url = "";
                            let keyResp = "";
                            let keyText = "";
                            if (NodeFormulaHandle.appMapMDUrls?.[data?.['content_type']]) {
                                if (NodeFormulaHandle.appMapMDUrls[data?.['content_type']]?.['url']) {
                                    url = NodeFormulaHandle.appMapMDUrls[data?.['content_type']]?.['url'];
                                }
                                if (NodeFormulaHandle.appMapMDUrls[data?.['content_type']]?.['keyResp']) {
                                    keyResp = NodeFormulaHandle.appMapMDUrls[data?.['content_type']]?.['keyResp'];
                                }
                                if (NodeFormulaHandle.appMapMDUrls[data?.['content_type']]?.['keyText']) {
                                    keyText = NodeFormulaHandle.appMapMDUrls[data?.['content_type']]?.['keyText'];
                                }
                            }
                            let areaBoxMDEle = NodeFormulaHandle.$propertyRemark[0].querySelector('.area-property-md');
                            let boxMDEle = NodeFormulaHandle.$propertyRemark[0].querySelector('.box-property-md');
                            if (areaBoxMDEle && boxMDEle) {
                                $(boxMDEle).attr('data-url', url);
                                $(boxMDEle).attr('data-method', 'GET');
                                $(boxMDEle).attr('data-keyResp', keyResp);
                                if (keyText) {
                                    $(boxMDEle).attr('data-keyText', keyText);
                                }
                                $(boxMDEle).attr('data-show', dataStr);
                                $(boxMDEle).attr('disabled', 'true');
                                loadInitS2($(boxMDEle), [], {}, NodeFormulaHandle.$propertyRemark, true);

                                $(areaBoxMDEle).removeClass('hidden');
                            }
                        }
                    }
                    if (tabEle.id === "tab_formula_function") {
                        NodeFormulaHandle.$functionRemark.empty();
                        NodeFormulaHandle.$functionRemark.append(htmlBase);
                    }
                }
            }
        }
        return true;
    };

    static clickParam(ele) {
        let dataEle = ele.querySelector('.data-show');
        if (dataEle) {
            if ($(dataEle).val()) {
                let data = JSON.parse($(dataEle).val());
                let tabEle = ele.closest('.tab-pane');
                if (tabEle) {
                    if (tabEle.id === "tab_formula_property") {
                        if (data?.['type'] === 5) {
                            let boxMDEle = NodeFormulaHandle.$propertyRemark[0].querySelector('.box-property-md');
                            if (boxMDEle) {
                                boxMDEle.removeAttribute('disabled');
                            }
                        } else {
                            // show editor
                            NodeFormulaHandle.$formulaEditor.val(NodeFormulaHandle.$formulaEditor.val() + data.syntax);
                            NodeFormulaHandle.$formulaEditor.focus();
                            NodeFormulaHandle.showValidate();
                        }
                    }
                    if (tabEle.id === "tab_formula_function") {
                        // show editor
                        NodeFormulaHandle.$formulaEditor.val(NodeFormulaHandle.$formulaEditor.val() + data.syntax);
                        NodeFormulaHandle.$formulaEditor.focus();
                        NodeFormulaHandle.showValidate();
                    }
                }
            }
        }
        return true;
    };

    static showValidate() {
        // validate editor
        let isValid = NodeFormulaHandle.validateEditor(NodeFormulaHandle.$formulaEditor.val());
        if (isValid?.['result'] === true) {
            if (NodeFormulaHandle.$btnSaveFormula[0].hasAttribute('disabled')) {
                NodeFormulaHandle.$btnSaveFormula[0].removeAttribute('disabled')
            }
            NodeFormulaHandle.$formulaValidateTxt.empty();
        } else {
            if (!NodeFormulaHandle.$btnSaveFormula[0].hasAttribute('disabled')) {
                NodeFormulaHandle.$btnSaveFormula[0].setAttribute('disabled', 'true');
            }
            let error = "";
            if (isValid?.['remark'] === "parentheses") {
                error = ") expected";
            } else if (isValid?.['remark'] === "syntax") {
                error = "syntax error";
            } else if (isValid?.['remark'] === "quote") {
                error = "single quote (') not allowed";
            } else if (isValid?.['remark'] === "unbalance") {
                error = "value or operator expected";
            }
            NodeFormulaHandle.$formulaValidateTxt.text(error);
        }
        return true;
    }

    static validateEditor(strValue) {
        let isValid = NodeFormulaHandle.validateParentheses(strValue);
        if (isValid === false) {
            return {
                'result': false,
                'remark': 'parentheses'
            }
        }
        isValid = NodeFormulaHandle.hasNonMatchingValue(strValue);
        if (isValid === false) {
            return {
                'result': false,
                'remark': 'syntax'
            }
        }
        isValid = NodeFormulaHandle.hasSingleQuote(strValue);
        if (isValid === false) {
            return {
                'result': false,
                'remark': 'quote'
            }
        }
        isValid = NodeFormulaHandle.notBalanceOperatorAndValue(strValue);
        if (isValid === false) {
            return {
                'result': false,
                'remark': 'unbalance'
            }
        }
        return {
            'result': true,
            'remark': ''
        }
    };

    static validateParentheses(strValue) {
        let stack = [];
        for (let i = 0; i < strValue.length; i++) {
            let char = strValue[i];
            if (char === "(") {
                // Push opening parenthesis to the stack
                stack.push(char);
            } else if (char === ")") {
                // Check if there is a corresponding opening parenthesis
                if (stack.length === 0 || stack.pop() !== "(") {
                    return false;
                }
            }
        }
        // Check if there are any unclosed parentheses
        return stack.length === 0;
    };

    static hasNonMatchingValue(strValue) {
        let str_test = "";
        let strValueNoSpace = strValue.replace(/\s/g, "");
        if (strValueNoSpace.length === 0) {
            return false;
        }
        let list_data = strValueNoSpace.match(NodeFormulaHandle.main_regex);
        if (list_data.length > 0) {
            for (let item of list_data) {
                str_test += item
            }
        }
        let str_test_no_space = str_test.replace(/\s/g, "");
        return strValueNoSpace.length === str_test_no_space.length
    };

    static hasSingleQuote(strValue) {
        return !strValue.includes("'")
    };

    static notBalanceOperatorAndValue(strValue) {
        let list_data = NodeFormulaHandle.parseStringToArray(strValue);
        let valueCount = 0;
        let operatorCount = 0;
        for (let data of list_data) {
            if (!["(", ")", "%"].includes(data)) {
                if (["+", "-", "*", "/"].includes(data)) {
                    operatorCount++;
                } else {
                    valueCount++
                }
            }
        }
        return operatorCount === (valueCount - 1);
    };

    static setupFormula() {
        let formula_list_raw = NodeFormulaHandle.parseStringToArray(NodeFormulaHandle.$formulaEditor.val());
        formula_list_raw = NodeFormulaHandle.parseItemInList(formula_list_raw);
        return {"formulaData": NodeFormulaHandle.parseFormulaRaw(formula_list_raw), "formulaShow": NodeFormulaHandle.$formulaEditor.val()};
    };

    static parseStringToArray(expression) {
        let data = expression.replace(/\s/g, "");
        return data.match(NodeFormulaHandle.main_regex);
    };

    static parseFormulaRaw(formula_list_raw) {
        let formula_data = [];
        let functionList = ['contains', 'empty', 'concat', 'min', 'max', 'sumItemIf'];
        for (let item of formula_list_raw) {
            if (functionList.some(value => item.includes(value))) { // FUNCTION
                let functionValue = functionList.find(value => item.includes(value));
                let functionJSON = NodeFormulaHandle.checkMatchPropertyIndicator(functionValue, 3);
                let functionBodyData = [];
                let functionBody = item.match(NodeFormulaHandle.body_nested_regex)[1];
                let body_list_raw = functionBody.match(NodeFormulaHandle.main_body_regex).map((match) => match.replace(/^"(.*)"$/, '$1'));
                for (let body_item of body_list_raw) {
                    if (body_item.includes("indicator")) {
                        let indicatorValue = body_item.match(NodeFormulaHandle.body_nested_regex)[1];
                        functionBodyData.push(NodeFormulaHandle.checkMatchPropertyIndicator(indicatorValue, 1));
                    } else if (body_item.includes("prop")) {
                        let propertyValue = body_item.match(NodeFormulaHandle.body_nested_regex)[1];
                        functionBodyData.push(NodeFormulaHandle.checkMatchPropertyIndicator(propertyValue, 2));
                    } else {
                        functionBodyData.push(body_item.toLowerCase());
                    }
                }
                functionBodyData = NodeFormulaHandle.parseItemInList(functionBodyData);
                functionJSON['function_data'] = functionBodyData;
                formula_data.push(functionJSON);
            } else if (item.includes("indicator")) { // INDICATOR
                let indicatorValue = item.match(NodeFormulaHandle.body_nested_regex)[1];
                formula_data.push(NodeFormulaHandle.checkMatchPropertyIndicator(indicatorValue, 1));
            } else if (item.includes("prop")) { // PROPERTY
                let propertyValue = item.match(NodeFormulaHandle.body_nested_regex)[1];
                formula_data.push(NodeFormulaHandle.checkMatchPropertyIndicator(propertyValue, 2));
            } else {
                formula_data.push(item)
            }
        }
        return formula_data;
    };

    static checkMatchPropertyIndicator(check_value, type) {
        let result = "";
        let params = [];
        // if (type === 1) {
        //     params = $indicatorMD[0].querySelectorAll('.param-item');
        // }
        if (type === 2) {
            params = NodeFormulaHandle.$propertyMD[0].querySelectorAll('.param-item');
        }
        if (type === 3) {
            params = NodeFormulaHandle.$functionMD[0].querySelectorAll('.param-item');
        }
        for (let param of params) {
            let dataShowEle = param.querySelector('.data-show');
            if (dataShowEle) {
                if ($(dataShowEle).val()) {
                    let data = JSON.parse($(dataShowEle).val());
                    if (data?.['title'].replace(/\s/g, "") === check_value) {
                        result = data;
                        break
                    }
                }
            }
        }
        return result;
    };

    static parseItemInList(data_list) {
        // valid "==", "!="
        for (let i = 0; i < data_list.length; i++) {
            let data = data_list[i];
            if (data === "==") {
                data_list[i] = "===";
            }
            if (data === "!=") {
                data_list[i] = "!==";
            }
        }
        // valid percent %
        data_list = data_list.map((item) => {
            if (item === "%") {
                return ["/", "100"];
            }
            return item;
        }).flat();

        return data_list;
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
