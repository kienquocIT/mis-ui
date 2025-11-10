$(function () {
    $(document).ready(function () {

        let formSubmit = $('#form-create_workflow');

        initTableZone();

        NodeLoadDataHandle.loadInit();

        // form submit
        SetupFormSubmit.validate(formSubmit, {
            rules: {
                title: {
                    required: true,
                    maxlength: 100,
                },
            },
            errorClass: 'is-invalid cl-red',
            submitHandler: submitHandlerFunc
        });

        function submitHandlerFunc() {
            let _form = new SetupFormSubmit(formSubmit);
            let dataZone = $('#table_workflow_zone').DataTable().data().toArray();
            _form.dataForm['zone'] = dataZone;
            if (formSubmit.attr('data-method') === 'PUT') {
                if (dataZone.length && typeof dataZone[0] === 'object')
                    // convert property list from object to id array list
                    for (let item of dataZone) {
                        let property_temp = []
                        for (let val of item.property_list) {
                            if (val !== null) {
                                if (typeof val === 'object') {
                                    property_temp.push(val?.['id']);
                                } else {
                                    property_temp.push(val);
                                }
                            }
                        }
                        item.property_list = property_temp
                    }
                _form.dataForm['zone'] = dataZone
            }
            let nodeData = NodeSubmitHandle.setupDataSubmit();
            let flowNode = FlowJsP.getCommitNode
            for (let item of nodeData) {
                if (flowNode.hasOwnProperty(item.order)) {
                    let node = document.getElementById(`control-${item.order}`);
                    item.coordinates = {};
                    let el = node;
                    if (el) {
                        let container = el.closest('#flowchart_workflow');
                        if (container) {
                            let containerRect = container.getBoundingClientRect();
                            let elRect = el.getBoundingClientRect();
                            let relativeLeft = elRect.left - containerRect.left;
                            let relativeTop = elRect.top - containerRect.top;
                            item.coordinates = {
                                top: relativeTop,
                                left: relativeLeft,
                            }
                        }
                    }
                } else {
                    item.coordinates = {};
                }
            }
            _form.dataForm['node'] = nodeData;

            // convert associate to json
            _form.dataForm['associate'] = "";
            let $eleAssociate = $('#node-associate');
            if ($eleAssociate.val()) {
                let associate_data_submit = [];
                let associate_data_json = JSON.parse($eleAssociate.val());
                for (let key in associate_data_json) {
                    let item = associate_data_json[key]
                    if (typeof item.node_in === "object") {
                        // case from detail page update workflow if node_in is not order number
                        item.node_in = item.node_in.order
                        item.node_out = item.node_out.order
                    }
                    if (item?.['node_in'] && item?.['node_out']) {
                        associate_data_submit.push(item);
                    }
                }
                if (associate_data_submit.length <= 0) {  // check required data association
                    $.fn.notifyB({description: NodeLoadDataHandle.transEle.attr('data-complete-association')}, 'failure');
                    return false;
                }
                _form.dataForm['association'] = associate_data_submit;
            }
            // Check required node
            if (!_form.dataForm.hasOwnProperty('node')) {
                $.fn.notifyB({description: NodeLoadDataHandle.transEle.attr('data-complete-node')}, 'failure');
                return false;
            }
            // Check required association
            if (!_form.dataForm.hasOwnProperty('association')) {
                $.fn.notifyB({description: NodeLoadDataHandle.transEle.attr('data-complete-association')}, 'failure');
                return false;
            }
            // Check node approved associate with node completed
            if (_form.dataForm.hasOwnProperty('node') && _form.dataForm.hasOwnProperty('association')) {
                let initial_order = null;
                let approved_order = null;
                // let completed_order = null;
                let checkHasInitial = false;
                let checkHasApproved = false;
                // let checkApprovedToComplete = false;
                for (let node of _form.dataForm?.['node']) {
                    if (node?.['code_node_system'] === 'initial') {
                        initial_order = node?.['order'];
                    }
                    if (node?.['code_node_system'] === 'approved') {
                        approved_order = node?.['order'];
                    }
                    // if (node?.['code_node_system'] === 'completed') {
                    //     completed_order = node?.['order'];
                    // }
                }
                for (let assoc of _form.dataForm?.['association']) {
                    if (assoc?.['node_in'] === initial_order) {
                        checkHasInitial = true;
                        break;
                    }
                }
                if (checkHasInitial === false) {
                    $.fn.notifyB({description: NodeLoadDataHandle.transEle.attr('data-require-node-initial')}, 'failure');
                    return false;
                }
                for (let assoc of _form.dataForm?.['association']) {
                    if (assoc?.['node_out'] === approved_order && assoc?.['node_in'] !== initial_order) {
                        checkHasApproved = true;
                        break;
                    }
                }
                if (checkHasApproved === false) {
                    $.fn.notifyB({description: NodeLoadDataHandle.transEle.attr('data-require-node-approved')}, 'failure');
                    return false;
                }
                // if (checkApprovedToComplete === false) {
                //     $.fn.notifyB({description: NodeLoadDataHandle.transEle.attr('data-complete-association')}, 'failure');
                //     return false;
                // }
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
            WindowControl.showLoading();
            $.fn.callAjax2(
                {
                    'url': _form.dataUrl,
                    'method': _form.dataMethod,
                    'data': _form.dataForm,
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: data.message}, 'success')
                        $.fn.redirectUrl(formSubmit.attr('data-url-redirect'), 1000);
                    }
                },
                (errs) => {
                    setTimeout(() => {
                        WindowControl.hideLoading();
                    }, 1000)
                    $.fn.notifyB({description: errs?.data?.errors || errs?.message}, 'failure');
                }
            )
        }

        // NODE EVENTS
        NodeLoadDataHandle.$boxApp.on('change', function () {
            NodeFormulaHandle.loadPropertyMD();
        });

        NodeLoadDataHandle.$btnNewNode.on('click', function () {
            NodeLoadDataHandle.$btnSaveNode[0].setAttribute('data-save-type', '0');
            NodeLoadDataHandle.$btnSaveNode[0].removeAttribute('data-order');
        });

        NodeLoadDataHandle.$nodeDragBox.on('click', '.config-node', function () {
            if (this.closest('.btn-group')) {
                if (this.closest('.btn-group').querySelector('.control')) {
                    let dataDrag = this.closest('.btn-group').querySelector('.control').getAttribute('data-drag');
                    NodeLoadDataHandle.$btnSaveNode[0].setAttribute('data-save-type', '1');
                    NodeLoadDataHandle.$btnSaveNode[0].setAttribute('data-order', dataDrag);
                }
            }
        });

        NodeLoadDataHandle.$flowChart.on('click', '.config-node', function () {
            if (this.closest('.btn-group')) {
                if (this.closest('.btn-group').querySelector('.clone')) {
                    let dataDrag = this.closest('.btn-group').querySelector('.clone').getAttribute('data-drag');
                    NodeLoadDataHandle.$btnSaveNode[0].setAttribute('data-save-type', '1');
                    NodeLoadDataHandle.$btnSaveNode[0].setAttribute('data-order', dataDrag);
                }
            }
        });

        NodeLoadDataHandle.$nodeDragBox.on('click', '.del-node', function () {
            if (this.closest('.btn-group')) {
                if (this.closest('.btn-group').querySelector('.control')) {
                    let target = parseInt(this.closest('.btn-group').querySelector('.control').getAttribute('data-drag'));
                    NodeLoadDataHandle.loadDeleteNode(target);
                }
            }
        });

        NodeLoadDataHandle.$flowChart.on('click', '.del-node', function () {
            if (this.closest('.btn-group')) {
                if (this.closest('.btn-group').querySelector('.clone')) {
                    let target = parseInt(this.closest('.btn-group').querySelector('.clone').getAttribute('data-drag'));
                    NodeLoadDataHandle.loadDeleteNode(target);
                }
            }
        });

        NodeLoadDataHandle.$modalNode.on('shown.bs.modal', function () {
            NodeLoadDataHandle.loadModalNode();
            NodeLoadDataHandle.loadModalNodeDetail();
        });

        NodeLoadDataHandle.$modalNode.on('hidden.bs.modal', function () {
            NodeLoadDataHandle.loadResetModal();
        });

        NodeLoadDataHandle.$modalNode.on('click', '.checkbox-action', function () {
            NodeLoadDataHandle.loadCheckActionGr(this);
            NodeLoadDataHandle.loadActionShow();
        });

        NodeLoadDataHandle.$boxSource.on('change', function () {
            NodeLoadDataHandle.loadCollabArea();
        });

        NodeDataTableHandle.$tableOFEmp.on('click', '.table-row-checkbox', function () {
            NodeLoadDataHandle.loadStoreCheckOFEmployee(this);
        });

        NodeLoadDataHandle.$modalNode.on('click', '.out-form-emp-show', function () {
            NodeDataTableHandle.dataTableCollabOutFormEmployee();
        });

        NodeLoadDataHandle.$modalNode.on('click', '.btn-save-out-form-employee', function () {
            NodeLoadDataHandle.loadOFEmpShow();
        });

        NodeLoadDataHandle.$boxInWFOpt.on('change', function () {
            NodeLoadDataHandle.loadInWFArea();
        });

        NodeLoadDataHandle.$modalNode.on('click', '.checkbox-zone-edit-all, .checkbox-zone-edit, .checkbox-zone-hidden', function () {
            NodeLoadDataHandle.loadCheckZone(this);
        });

        NodeLoadDataHandle.$modalNode.on('click', '.del-row', function () {
            delWFNodeRowTable(this.closest('tr'), NodeDataTableHandle.$tableInWF);
            NodeLoadDataHandle.loadExitConDefault();
        });

        NodeLoadDataHandle.$modalNode.on('click', '.btn-save-in-workflow-employee', function () {
            NodeLoadDataHandle.loadInWFShow();
        });

        NodeLoadDataHandle.$btnSaveNode.on('click', function () {
            NodeStoreHandle.storeNode();
        });

        NodeDataTableHandle.$tableInWFExitCon.on('change', '.table-row-min-collab', function () {
            NodeLoadDataHandle.loadChangeExitCon(this);
        });

        NodeLoadDataHandle.$modalCondition.on('click', '.btn-cond', function () {
            NodeFormulaHandle.$formulaEditor.val("");
            NodeFormulaHandle.$btnSaveFormula.attr('data-cls-target', $(this).attr('data-cls-target'));
            let targetEle = NodeLoadDataHandle.$modalCondition[0].querySelector(`.${NodeFormulaHandle.$btnSaveFormula.attr('data-cls-target')}`);
            if (targetEle) {
                NodeFormulaHandle.$formulaEditor.val($(targetEle).val());
            }
        });

        NodeLoadDataHandle.$modalCondition.on('change', '.operator-and-or-main', function () {
            for (let operatorAndOrEle of NodeLoadDataHandle.$modalCondition[0].querySelectorAll('.operator-and-or')) {
                if (operatorAndOrEle !== this) {
                    $(operatorAndOrEle).val($(this).val()).trigger('change');
                }
            }
        });

        NodeLoadDataHandle.$modalCondition.on('change', '.operator-and-or-child-main', function () {
            let blockCondChildEle = this.closest('.block-cond-child');
            if (blockCondChildEle) {
                for (let operatorAndOrChildEle of blockCondChildEle.querySelectorAll('.operator-and-or-child')) {
                    if (operatorAndOrChildEle !== this) {
                        $(operatorAndOrChildEle).val($(this).val()).trigger('change');
                    }
                }
            }
        });

        NodeLoadDataHandle.$modalCondition.on('click', '.btn-add-block-cond', function () {
            FlowChartLoadDataHandle.loadAddBlockCond();
        });

        NodeLoadDataHandle.$modalCondition.on('click', '.btn-add-block-cond-child', function () {
            FlowChartLoadDataHandle.loadAddBlockCondChild(this);
        });

        NodeLoadDataHandle.$modalCondition.on('click', '.btn-del-block-cond', function () {
            FlowChartLoadDataHandle.loadDeleteBlockCond(this);
        });

        NodeLoadDataHandle.$modalCondition.on('click', '.btn-del-block-cond-child', function () {
            FlowChartLoadDataHandle.loadDeleteBlockCondChild(this);
        });

        NodeFormulaHandle.$formulaCanvas.on('mouseenter', '.param-item', function () {
            NodeFormulaHandle.mouseenterParam(this);
        });

        NodeFormulaHandle.$formulaCanvas.on('click', '.param-item', function () {
            NodeFormulaHandle.clickParam(this);
        });

        NodeFormulaHandle.$formulaCanvas.on('change', '.box-property-md', function () {
            let dataShowRaw = $(this).attr('data-show');
            if (dataShowRaw) {
                let dataShow = JSON.parse(dataShowRaw);
                let dataSelected = SelectDDControl.get_data_from_idx($(this), $(this).val());
                if (dataSelected) {
                    let text = "";
                    if (dataSelected?.['title']) {
                        text = dataSelected?.['title'];
                    }
                    if (dataSelected?.['full_name']) {
                        text = dataSelected?.['full_name'];
                    }
                    if (dataSelected?.['name']) {
                        text = dataSelected?.['name'];
                    }
                    // show editor
                    NodeFormulaHandle.$formulaEditor.val(`${NodeFormulaHandle.$formulaEditor.val() + dataShow?.['syntax']}=="${text}"`);
                    // on blur editor to validate formula
                    NodeFormulaHandle.$formulaEditor.blur();
                }
            }
        });

        NodeFormulaHandle.$formulaEditor.on('blur', function () {
            NodeFormulaHandle.showValidate();
        });

        NodeFormulaHandle.$btnSaveFormula.on('click', function () {
            let dataSetup = NodeFormulaHandle.setupFormula();
            let targetEle = NodeLoadDataHandle.$modalCondition[0].querySelector(`.${NodeFormulaHandle.$btnSaveFormula.attr('data-cls-target')}`);
            if (targetEle) {
                $(targetEle).attr('data-formula', JSON.stringify(dataSetup?.['formulaData']));
                $(targetEle).val(dataSetup?.['formulaShow']);
            }
        });

        NodeLoadDataHandle.$btnSaveCondition.on('click', function () {
            FlowChartLoadDataHandle.loadSaveCondition();
        });
    });
});
