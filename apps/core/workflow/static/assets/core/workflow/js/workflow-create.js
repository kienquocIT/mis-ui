$(function () {
    $(document).ready(function () {

        let formSubmit = $('#form-create_workflow');
        // init select function applied
        let $select_box = $("#select-box-features");
        $select_box.initSelect2({
            'allowClear': true,
        });

        initTableZone();

        NodeLoadDataHandle.loadInitEmpData();

        // form submit
        formSubmit.submit(function (e) {
            e.preventDefault()
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
                    let offset = jsPlumb.getOffset(node);
                    // item.condition = flowNode[item.order].condition
                    item.coordinates = {
                        top: offset.top,
                        left: offset.left,
                    }
                } else {
                    // item.condition = []
                    item.coordinates = {}
                }
            }
            _form.dataForm['node'] = nodeData;

            // convert associate to json
            _form.dataForm['associate'] = "";
            let $eleAssociate = $('#node-associate');
            if ($eleAssociate.val()) {
                _form.dataForm['associate'] = $eleAssociate.val();
            }
            let associate_temp = _form.dataForm['associate'];
            if (associate_temp) {
                let associate_data_submit = [];
                let associate_data_json = JSON.parse(associate_temp);
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
            if (!_form.dataForm.hasOwnProperty('node')) {
                $.fn.notifyB({description: NodeLoadDataHandle.transEle.attr('data-complete-node')}, 'failure');
                return false;
            }
            if (!_form.dataForm.hasOwnProperty('association')) {
                $.fn.notifyB({description: NodeLoadDataHandle.transEle.attr('data-complete-association')}, 'failure');
                return false;
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
                            $.fn.notifyB({description: data.message}, 'success')
                            $.fn.redirectUrl(formSubmit.attr('data-url-redirect'), 1000);
                        }
                    },
                    (errs) => {
                        console.log(errs)
                        $.fn.notifyB({description: "Workflow create fail"}, 'failure')
                    }
                )
        });


        // NODE EVENTS
        NodeLoadDataHandle.$btnNewNode.on('click', function () {
            NodeLoadDataHandle.$btnSaveNode[0].setAttribute('data-save-type', '0');
            NodeLoadDataHandle.$btnSaveNode[0].removeAttribute('data-order');
        });

        $('#node_dragbox').on('click', '.control', function() {
            NodeLoadDataHandle.$btnSaveNode[0].setAttribute('data-save-type', '1');
            NodeLoadDataHandle.$btnSaveNode[0].setAttribute('data-order', this.getAttribute('data-drag'));
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

        NodeLoadDataHandle.$modalNode.on('click', '.btn-save-out-form-employee', function () {
            NodeLoadDataHandle.loadOFEmpShow();
        });

        NodeLoadDataHandle.$boxInWFOpt.on('change', function () {
            NodeLoadDataHandle.loadInWFArea();
        });

        NodeLoadDataHandle.$modalNode.on('click', '.checkbox-zone-edit-all, .checkbox-zone-edit, .checkbox-zone-hidden', function () {
            NodeLoadDataHandle.loadCheckZone(this);
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

    });
});
