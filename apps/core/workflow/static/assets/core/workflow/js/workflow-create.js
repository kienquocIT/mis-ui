"use strict";

$(function () {
    $(document).ready(function () {

        // init select function applied
        let $select_box = $("#select-box-features");
        let selectURL = $select_box.attr('data-url')
        $select_box.select2({
            ajax: {
                url: selectURL,
                processResults: function (res) {
                    let data_original = res.data[$select_box.attr('data-prefix')];
                    let data_convert = []
                    if (data_original.length) {
                        for (let item of data_original) {
                            data_convert.push({...item, 'text': item.title})
                        }
                    }
                    return {
                        results: data_convert
                    };
                }
            },
            tags: true,
            multiple: true,
            tokenSeparators: [',', ' ']
        })

        initTableZone()

        // form submit
        $('#btn-create_workflow').on('click', function (e) {
            e.preventDefault()
            let $form = document.getElementById('form-create_workflow')
            let _form = new SetupFormSubmit($('#form-create_workflow'))
            _form.dataForm['zone'] = $('#table_workflow_zone').DataTable().data().toArray()
            let nodeTableData = setupDataNode(true);
            // check status Node before submit
            if (nodeTableData === false) {
                $.fn.notifyPopup({description: 'Please complete Nodes data'}, 'failure');
                return false
            }
            // get exit node condition for node list
            // if (COMMIT_NODE_LIST)
            let flowNode = FlowJsP.getCommitNode
            for (let item of nodeTableData) {
                if (flowNode.hasOwnProperty(item.order)){
                    let node = document.getElementById(`control-${item.order}`);
                    let offset = jsPlumb.getOffset(node);
                    item.condition = flowNode[item.order].condition
                    item.coordinates = {
                        top: offset.top,
                        left: offset.left,
                    }
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
               for (let key in associate_data_json) {
                   let item = associate_data_json[key]
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
                            $.fn.redirectUrl($($form).attr('data-url-redirect'), 1000);
                        }
                    },
                    (errs) => {
                        console.log(errs)
                        $.fn.notifyPopup({description: "Workflow create fail"}, 'failure')
                    }
                )
        });

    });
});
