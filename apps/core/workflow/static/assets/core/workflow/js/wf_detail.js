$(function () {
    /***
     * get data received form ajax and parse value to HTML
     * @param res response data of workflow detail
     * @param {{is_define_zone:string}} data
     */
    function prepareDataAndRenderHTML(res){
        if(res.title) $('[name="title"]').val(res.title);
        if (res.application) {
            $("#select-box-features").initSelect2({
                data: res.application,
            });
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
            $form.find('input[readonly]').removeAttr('readonly');
            $form.find('input[type="checkbox"][disabled]:not(.is-not-enabled)').prop('disabled', false);
            $form.find('select[disabled]:not(.is-not-enabled)').prop('disabled', false);
            $form.find('.wf-is-editable').prop('disabled', false);
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
                        $.fn.notifyB({description: data.message}, 'success')
                        $.fn.redirectUrl(frm.dataUrlRedirect, 3000);
                    }
                },
                (errs) => {
                    // if (errs.data.errors.hasOwnProperty('detail')) {
                    //     $.fn.notifyB({description: String(errs.data.errors['detail'])}, 'failure')
                    // }
                }
            )
        }
        })
    }



    $(document).ready(function() {
        let formSubmit = $('#form-create_workflow');
        // call ajax get info wf detail
        $.fn.callAjax2({
            url: formSubmit.data('url'),
            method: 'GET',
            isLoading: true,
        }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        prepareDataAndRenderHTML(data);
                        NodeLoadDataHandle.loadDetailNode(data?.['node']);
                        // clickEditForm();
                        // UpdateFormSubmit();
                    }
                }
            )

        // form submit
        // $('#btn-detail_workflow').on('click', function (e) {
        //     e.preventDefault()
        //     let $form = document.getElementById('form-detail_workflow')
        //     let _form = new SetupFormSubmit($('#form-detail_workflow'))
        //     let dataZone = $('#table_workflow_zone').DataTable().data().toArray()
        //     if (dataZone.length && typeof dataZone[0] === 'object')
        //         // convert property list from object to id array list
        //         for (let item of dataZone){
        //             let property_temp = []
        //             for (let val of item.property_list){
        //                 property_temp.push(val.id)
        //             }
        //             item.property_list = property_temp
        //         }
        //     _form.dataForm['zone'] = dataZone
        //     let nodeTableData = NodeSubmitHandle.setupDataSubmit();
        //     // check status Node before submit
        //     // if (nodeTableData === false) {
        //     //     $.fn.notifyB({description: NodeLoadDataHandle.transEle.attr('data-check-complete-node')}, 'failure');
        //     //     return false
        //     // }
        //     // add condition object for node list
        //     // if (COMMIT_NODE_LIST)
        //     let flowNode = FlowJsP.getCommitNode
        //     for (let item of nodeTableData) {
        //         if (flowNode.hasOwnProperty(item.order)){
        //             const node = document.getElementById(`control-${item.order}`);
        //             const offset = jsPlumb.getOffset(node);
        //             //add coord of node
        //             item.coordinates = {
        //                 top: offset.top,
        //                 left: offset.left,
        //             }
        //             item.condition = flowNode[item.order]
        //         }
        //         else{
        //             item.condition = []
        //             item.coordinates = {}
        //         }
        //
        //     }
        //     _form.dataForm['node'] = nodeTableData
        //
        //     // convert associate to json
        //     let associate_temp = _form.dataForm['associate'].replaceAll('\\', '');
        //     if (associate_temp) {
        //         let associate_data_submit = [];
        //        let associate_data_json =  JSON.parse(associate_temp);
        //        for (let item of associate_data_json) {
        //            if (typeof item.node_in === "object"){
        //                // case from detail page update workflow if node_in is not order number
        //                item.node_in = item.node_in.order
        //                item.node_out = item.node_out.order
        //            }
        //            associate_data_submit.push(item);
        //        }
        //        _form.dataForm['association'] = associate_data_submit;
        //     }
        //
        //     let submitFields = [
        //         'title',
        //         'application',
        //         'node',
        //         'zone',
        //         'is_multi_company',
        //         'is_define_zone',
        //         'actions_rename',
        //         'association',
        //     ]
        //     if (_form.dataForm) {
        //         for (let key in _form.dataForm) {
        //             if (!submitFields.includes(key)) delete _form.dataForm[key]
        //         }
        //     }
        //     let temp = _form.dataForm['actions_rename']
        //     if (temp) _form.dataForm['actions_rename'] = JSON.parse(temp)
        //     else _form.dataForm['actions_rename'] = []
        //
        //     let csr = $("[name=csrfmiddlewaretoken]").val()
        //
        //     $.fn.callAjax(_form.dataUrl, _form.dataMethod, _form.dataForm, csr)
        //         .then(
        //             (resp) => {
        //                 let data = $.fn.switcherResp(resp);
        //                 if (data) {
        //                     $.fn.notifyB({description: data.message}, 'success')
        //                     $.fn.redirectUrl($($form).attr('data-url-redirect'), 3000);
        //                 }
        //             },
        //             (errs) => {
        //                 console.log(errs)
        //                 $.fn.notifyB({description: "Workflow create fail"}, 'failure')
        //             }
        //         )
        // });

    }); // end document ready
});