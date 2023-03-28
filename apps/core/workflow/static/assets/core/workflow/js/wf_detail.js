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
        if (res.node) $('#node-list').val(JSON.stringify(res.node)) // khúc này đợi P làm function node rồi ráp vào
        if (res.association) $('#associate-connect').val(JSON.stringify(res.association))
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

    /***
     * get data list of nodes from detail
     */
    function loadAction(action_list, is_system_node = true) {
        let actionEle = ``;
        let nodeActionRaw = $('#wf_action').text();
        if (nodeActionRaw) {
            let nodeAction = JSON.parse(nodeActionRaw);
            let inputEle = ``;
            if (is_system_node === true) {
                for (let key in nodeAction) {
                    if (String(key) === "0") {
                        inputEle = `<input type="checkbox" class="check-action-node" id="customCheck6" checked disabled>`;
                    } else {
                        inputEle = `<input type="checkbox" class="check-action-node" id="customCheck6" disabled>`;
                    }
                    actionEle += `<li class="d-flex align-items-center justify-content-between mb-3">
                            <div class="media d-flex align-items-center">
                                <div class="media-body">
                                    <div>
                                        <div class="node-action" data-action="${String(key)}">${nodeAction[key]}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="form-check form-check-theme ms-3">
                                ${inputEle}
                                <label class="form-check-label" for="customCheck6"></label>
                            </div>
                        </li>`
                }
            } else {
                for (let key in nodeAction) {
                    if (String(key) === "0") {
                        inputEle = `<input type="checkbox" class="form-check-input check-action-node" id="customCheck6" disabled>`
                    } else {
                        if (action_list.includes(Number(key))) {
                            inputEle = `<input type="checkbox" class="form-check-input check-action-node" id="customCheck6" checked>`;
                        } else {
                            inputEle = `<input type="checkbox" class="form-check-input check-action-node" id="customCheck6">`;
                        }
                    }
                    actionEle += `<li class="d-flex align-items-center justify-content-between mb-3">
                            <div class="media d-flex align-items-center">
                                <div class="media-body">
                                    <div>
                                        <div class="node-action" data-action="${String(key)}">${nodeAction[key]}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="form-check form-check-theme ms-3">
                                ${inputEle}
                                <label class="form-check-label" for="customCheck6"></label>
                            </div>
                        </li>`
                }
            }
        }
        return actionEle
    }

    function setupNodeOrder(row, data, dataLen) {
        let systemRowClass = "";
        let initialCheckBox = "";
        if (data.code_node_system === 'initial') {
            if (dataLen === 3) {
                systemRowClass = "initial-row";
            }
            initialCheckBox = String(data.order)
            $(row).addClass(systemRowClass);
            $(row).attr("data-initial-check-box", initialCheckBox);
        } else if (data.code_node_system === 'approved') {
            systemRowClass = "approved-row";
            initialCheckBox = String(data.order)
            $(row).addClass(systemRowClass);
            $(row).attr("data-initial-check-box", initialCheckBox);
        } else if (data.code_node_system === 'completed') {
            systemRowClass = "completed-row";
            initialCheckBox = String(data.order)
            $(row).addClass(systemRowClass);
            $(row).attr("data-initial-check-box", initialCheckBox);
        } else {
            if (dataLen !== 3) {
                if (data.order === (dataLen - 2)) {
                    systemRowClass = "initial-row";
                }
                initialCheckBox = String(data.order)
                $(row).addClass(systemRowClass);
                $(row).attr("data-initial-check-box", initialCheckBox);
            }
        }
    }

    function loadTableNode(data) {
        // init dataTable
        let listData = data ? data : [];
        let dataLen = listData.length;
        let $tables = $('#datable-workflow-node-create');
        $tables.DataTable({
            data: listData,
            searching: false,
            ordering: false,
            paginate: false,
            info: false,
            drawCallback: function (row, data) {
                // render icon after table callback
                feather.replace();
            },
            rowCallback: function (row, data) {
                setupNodeOrder(row, data, dataLen);
            },
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        let currentId = "";
                        if (row.code_node_system === 'initial') {
                            currentId = "check_sel_1";
                        }
                        return `<span class="form-check mb-0"><input type="checkbox" class="form-check-input check-select check-add-workflow-node" id="${currentId}"><label class="form-check-label" for="${currentId}"></label></span>`
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<span class="node-title" data-is-system="true" data-system-code="${row.code}">${row.title}</span>`
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        if (row.description) {
                            return `<span class="node-description">${row.description}</span>`
                        } else {
                            return `<span class="node-description"></span>`
                        }
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        let actionEle = ``;
                        if (row.code_node_system === 'initial') {
                            actionEle = loadAction(row.actions, true);
                            return `<div class="row">
                                        <div class="col-8">
                                            <div class="btn-group dropdown">
                                                <i class="fas fa-align-justify" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="color: #cccccc"></i>
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
                                            <span class=""><i class="fas fa-check" style="color: #00D67F; font-size: 20px"></i></span>
                                        </div>
                                    </div>`;
                        } else if (row.code_node_system === 'approved' || row.code_node_system === 'completed') {
                            return `<div class="row">
                                        <div class="col-8">
                                            <i class="fas fa-align-justify" style="color: #cccccc"></i>
                                        </div>
                                        <div class="col-4">
                                            <span class="check-done-audit"><i class="fas fa-check" style="color: #00D67F; font-size: 20px"></i></span>
                                        </div>
                                    </div>`
                        } else {
                            if (row.actions) {
                                actionEle = loadAction(row.actions, false);
                            }
                            return `<div class="row">
                                        <div class="col-8">
                                            <div class="btn-group dropdown">
                                                <i class="fas fa-align-justify" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
                                                <div class="dropdown-menu w-250p"><div class="h-250p"><div data-simplebar class="nicescroll-bar">
                                                    <ul class="node-action-list p-0">
                                                        ${actionEle}
                                                    </ul>
                                                </div>
                                                </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-4">
                                            <span class="check-done-action"><i class="fas fa-times" style="color: red; font-size: 20px"></i></span>
                                        </div>
                                    </div>`
                        }
                    },
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        if (row.order === 1) {
                            return `<div class="row">
                                        <div class="col-8">
                                            <i class="fas fa-align-justify btn-initial-node-collaborator" data-bs-toggle="modal" data-bs-target="#auditModalCreateInitial"></i>
                                            <div
                                                class="modal fade" id="auditModalCreateInitial" tabindex="-1" role="dialog"
                                                aria-labelledby="exampleModalCenter" aria-hidden="true"
                                            >
                                                <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                                                    <div class="modal-content">
                                                        <div class="modal-header">
                                                            <h5 class="modal-title">Add Collaborators</h5>
                                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                                                <span aria-hidden="true">&times;</span>
                                                            </button>
                                                        </div>
                                                        <div class="modal-body">
                                                            <table
                                                                id=""
                                                                class="table nowrap w-100 mb-5 table-initial-node-collaborator"
                                                            >
                                                                <thead>
                                                                <tr>
                                                                    <th>Collaborator</th>
                                                                    <th>Position</th>
                                                                    <th>Role</th>
                                                                    <th>Editing Zone</th>
                                                                </tr>
                                                                </thead>
                                                                <tbody>
                                                                <td>Creator</td>
                                                                <td>Creator's position</td>
                                                                <td>Creator's role</td>
                                                                <td class="initial-node-collaborator-zone"></td>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                        <div class="modal-footer">
                                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                            <button type="button" class="btn btn-primary btn-add-audit-create" data-bs-dismiss="modal">Save changes</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-4">
                                            <span class="check-done-audit"><i class="fas fa-check" style="color: #00D67F; font-size: 20px"></i></span>
                                        </div>
                                    </div>`
                        } else {
                            return `<div class="row">
                                        <div class="col-8">
                                            <i class="fas fa-align-justify" style="color: #cccccc"></i>
                                        </div>
                                        <div class="col-4">
                                            <span class="check-done-audit"><i class="fas fa-check" style="color: #00D67F; font-size: 20px"></i></span>
                                        </div>
                                    </div>`;
                        }

                    }
                },
                {
                    targets: 5,
                    render: () => {
                        let bt2 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Edit" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit" style="color: #cccccc"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></span></span></a>`;
                        let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2" style="color: #cccccc"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></span></span></a>`;
                        let actionData = bt2 + bt3;
                        return `${actionData}`
                    }
                },
            ],
        });
    }

    $(document).ready(function() {
        let $form = $('#form-detail_workflow')

        // call ajax get info wf detail
        $.fn.callAjax($form.data('url'), 'GET')
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        console.dir(data)
                        prepareDataAndRenderHTML(data);
                        loadTableNode(data.node);
                        clickEditForm();
                        UpdateFormSubmit();
                    }
                }
            )

        // form submit
        $('#btn-detail_workflow').on('click', function (e) {
            e.preventDefault()
            let $form = document.getElementById('form-detail_workflow')
            let _form = new SetupFormSubmit($form)
            _form.dataForm['zone'] = $('#table_workflow_zone').DataTable().data().toArray()
            let nodeTableData = setupDataNode(true);
            // add condition object for node list
            // if (COMMIT_NODE_LIST)
            let flowNode = FlowJsP.getCommitNode
            for (let item of flowNode) {
                if (flowNode.hasOwnProperty(item.order))
                    item.condition = flowNode[item.order]
                else item.condition = []
            }
            _form.dataForm['node'] = nodeTableData

            // đang dừng ở đây

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