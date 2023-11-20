$(function () {
    $(document).ready(function () {

        let formSubmit = $('#form-create_workflow');
        // init select function applied
        let $select_box = $("#select-box-features");
        $select_box.initSelect2({
            'dataParams': {'is_workflow': true},
            'allowClear': true,
        });

        // init DataTable
        if (formSubmit.attr('data-method') === 'POST') {
            initTableZone();
            NodeLoadDataHandle.loadSystemNode();
        }

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
                            property_temp.push(val.id)
                        }
                        item.property_list = property_temp
                    }
                _form.dataForm['zone'] = dataZone
            }
            let nodeData = NodeSubmitHandle.setupDataSubmit();
            // check status Node before submit
            // if (nodeData === false) {
            //     $.fn.notifyB({description: NodeLoadDataHandle.transEle.attr('data-check-complete-node')}, 'failure');
            //     return false
            // }
            // get exit node condition for node list
            // if (COMMIT_NODE_LIST)
            let flowNode = FlowJsP.getCommitNode
            for (let item of nodeData) {
                if (flowNode.hasOwnProperty(item.order)) {
                    let node = document.getElementById(`control-${item.order}`);
                    let offset = jsPlumb.getOffset(node);
                    item.condition = flowNode[item.order].condition
                    item.coordinates = {
                        top: offset.top,
                        left: offset.left,
                    }
                } else {
                    item.condition = []
                    item.coordinates = {}
                }
            }
            _form.dataForm['node'] = nodeData;

            // convert associate to json
            let associate_temp = _form.dataForm['associate'].replaceAll('\\', '');
            if (associate_temp) {
                let associate_data_submit = [];
                let associate_data_json = JSON.parse(associate_temp);
                if (formSubmit.attr('data-method') === 'POST') {
                    for (let key in associate_data_json) {
                        let item = associate_data_json[key]
                        if (typeof item.node_in === "object") {
                            // case from detail page update workflow if node_in is not order number
                            item.node_in = item.node_in.order
                            item.node_out = item.node_out.order
                        }
                        associate_data_submit.push(item);
                    }
                }
                if (formSubmit.attr('data-method') === 'PUT') {
                    for (let item of associate_data_json) {
                        if (typeof item.node_in === "object") {
                            // case from detail page update workflow if node_in is not order number
                            item.node_in = item.node_in.order
                            item.node_out = item.node_out.order
                        }
                        associate_data_submit.push(item);
                    }
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
        NodeDataTableHandle.tableNode.on('click', '.btn-node-collab', function () {
            NodeLoadDataHandle.loadZoneDD(this.closest('tr'));
        });

        NodeLoadDataHandle.btnAddNode.on('click', function () {
            NodeLoadDataHandle.loadAddRowTableNode();
            NodeLoadDataHandle.nodeModalTitleEle.val("");
            NodeLoadDataHandle.nodeModalDescriptionEle.val("");
        });

        NodeDataTableHandle.tableNode.on('click', '.check-action-node', function () {
            NodeLoadDataHandle.loadCheckGroupAction(this);
            NodeLoadDataHandle.loadDoneFailAction(this);
        });

        NodeDataTableHandle.tableNode.on('change', '.box-list-source', function () {
            NodeLoadDataHandle.loadAreaByListSource(this);
        });

        NodeDataTableHandle.tableNode.on('click', '.checkbox-node-zone-all', function () {
            let eleZoneDD = this.closest('.dropdown-zone');
            for (let eleCheckbox of eleZoneDD.querySelectorAll('.checkbox-node-zone')) {
                eleCheckbox.checked = this.checked;
            }
            NodeLoadDataHandle.loadZoneShow(this);
        });

        NodeDataTableHandle.tableNode.on('click', '.checkbox-node-zone', function () {
            NodeLoadDataHandle.loadZoneShow(this);
        });

        NodeDataTableHandle.tableNode.on('click', '.button-add-out-form-employee', function () {
            NodeLoadDataHandle.loadOutFormEmployeeShow(this);
        });

        NodeDataTableHandle.tableNode.on('change', '.box-in-workflow-company', function () {
            let boxRole = this.closest('.collab-in-workflow-area').querySelector('.box-in-workflow-role');
            $(boxRole).empty();
            NodeLoadDataHandle.loadBoxRole($(boxRole));
            let boxEmployee = this.closest('.collab-in-workflow-area').querySelector('.box-in-workflow-employee');
            $(boxEmployee).empty();
            NodeLoadDataHandle.loadBoxEmployee($(boxEmployee));
        });

        NodeDataTableHandle.tableNode.on('change', '.box-in-workflow-role', function () {
            let boxEmployee = this.closest('.collab-in-workflow-area').querySelector('.box-in-workflow-employee');
            $(boxEmployee).empty();
            NodeLoadDataHandle.loadBoxEmployee($(boxEmployee));
        });

        NodeDataTableHandle.tableNode.on('change', '.box-in-workflow-option', function () {
            NodeLoadDataHandle.loadInWFArea(this);
        });

        NodeDataTableHandle.tableNode.on('click', '.button-add-in-workflow-employee', function () {
            NodeLoadDataHandle.loadInWFEmployeeShow(this);
        });

        NodeDataTableHandle.tableNode.on('click', '.btn-add-collab-create', function () {
            NodeLoadDataHandle.loadDoneFailCollab(this);
        });


    });
});
