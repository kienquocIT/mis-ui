$(function () {
    /***
     * get data received form ajax and parse value to HTML
     * @param res response data of workflow detail
     * @param {{is_define_zone:string}} data
     */
    function prepareDataAndRenderHTML(res){
        if(res.title) $('[name="title"]').val(res.title);
        if(res.application){
            const elmApp = $('[name="application"]');
            elmApp.attr('data-onload', JSON.stringify(res.application));
            initSelectbox(elmApp)
        }
        if (res.is_define_zone) $('[name="define_zone"]').val(res.is_define_zone);
        if (res.zone) initTableZone(res.zone);
        if (res.node) $('#node-list').val(JSON.stringify(res.node))
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
            $form.find('input[readonly]').removeAttr('readonly')
            $form.find('input[type="checkbox"][disabled]').prop('disabled', false)
            $form.find('select[disabled]').prop('disabled', false)
        });
    }

    /***
     * call ajax update form when user click update
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
                        $.fn.notifyPopup({description: data.message}, 'success')
                        $.fn.redirectUrl(frm.dataUrlRedirect, 3000);
                    }
                },
                (errs) => {
                    // if (errs.data.errors.hasOwnProperty('detail')) {
                    //     $.fn.notifyPopup({description: String(errs.data.errors['detail'])}, 'failure')
                    // }
                }
            )
        }
        })
    }

    $(document).ready(function() {
        let $form = $('#form-detail_workflow')

        // call ajax get info wf detail
        $.fn.callAjax($form.data('url'), 'GET')
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        prepareDataAndRenderHTML(data);
                        clickEditForm();
                        UpdateFormSubmit();
                    }
                }
            )

        // form submit
        $('#btn-detail_workflow').on('click', function (e) {
            e.preventDefault()
            let $form = document.getElementById('form-detail_workflow')
            let _form = new SetupFormSubmit($('#form-detail_workflow'))
            _form.dataForm['zone'] = $('#table_workflow_zone').DataTable().data().toArray()
            let nodeTableData = setupDataNode(true);
            // add condition object for node list
            // if (COMMIT_NODE_LIST)
            let flowNode = FlowJsP.getCommitNode
            for (let item of nodeTableData) {
                var node = document.getElementById(`control-${item.order}`);
                var offset = jsPlumb.getOffset(node);
                if (flowNode.hasOwnProperty(item.order)){
                    //add coord of node
                    item.coord = {
                        top: offset.top,
                        left: offset.left,
                    }
                    item.condition = flowNode[item.order]
                }
                else{
                    item.condition = []
                    item.coord = {}
                }

            }
            _form.dataForm['node'] = nodeTableData

            // convert associate to json
            let associate_temp = _form.dataForm['associate'].replaceAll('\\', '');
            if (associate_temp) {
                let associate_data_submit = [];
               let associate_data_json =  JSON.parse(associate_temp);
               for (let key in associate_data_json) {
                   associate_data_submit.push(associate_data_json[key]);
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
                'association'
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
                            $.fn.redirectUrl($($form).attr('data-url-redirect'), 3000);
                        }
                    },
                    (errs) => {
                        console.log(errs)
                        $.fn.notifyPopup({description: "Workflow create fail"}, 'failure')
                    }
                )
        });

    }); // end document ready
}, jQuery);