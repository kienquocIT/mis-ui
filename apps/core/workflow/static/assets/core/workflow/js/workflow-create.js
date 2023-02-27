"use strict";
let ZONE_INDEX = 0;
$(function () {

    $(document).ready(function () {
        // declare global scope variable
        let $prev_btn = $('#nav-next-prev-step .prev-btn');
        let $next_btn = $('#nav-next-prev-step .next-btn');

        // init select function applied ---> chưa viết docs cho select2
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

        // init dataTable
        let $tables = $('#table_workflow_zone');
        $tables.each(function () {
            let $elm = $(this);
            $elm.DataTable({
                searching: false,
                ordering: false,
                paginate: false,
                info: false,
                drawCallback: function (row, data) {
                    // render icon after table callback
                    feather.replace();
                    // reorder from index to order
                    if (data) {
                        let api = this.api()
                        let newIndex = api.row(row).index()
                        data['order'] = newIndex + 1
                    }
                },
                rowCallback: function (row, data) {
                    // handle onclick btn
                    $('.actions-btn a', row).off().on('click', function (e) {
                        e.stopPropagation();
                        actionsClick(row, data, e)
                    })
                },
                columns: [
                    {
                        targets: 0,
                        render: () => {
                            return `<div class="form-check"><input type="checkbox" class="form-check-input"></div>`
                        }
                    },
                    {
                        targets: 1,
                        render: (data, type, row) => {
                            return `<p>${row.title}</p>`
                        }
                    },
                    {
                        targets: 2,
                        render: (data, type, row) => {
                            return `<p>${row.remark}</p>`
                        }
                    },
                    {
                        targets: 3,
                        render: (data, type, row) => {
                            let _id = row.order
                            if (row.hasOwnProperty('id') && row.id)
                                _id = row.id
                            return `<div class="actions-btn">
                                        <a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button"
                                           title="Edit"
                                           href="#"
                                           data-id="${_id}"
                                           data-action="edit">
                                            <span class="feather-icon">
                                                <i data-feather="edit"></i>
                                            </span>
                                        </a>
                                        <a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover delete-btn"
                                           title="Delete"
                                           href="#"
                                           data-id="${_id}"
                                           data-action="delete">
                                            <span class="btn-icon-wrap">
                                                <span class="feather-icon">
                                                    <i data-feather="trash-2"></i>
                                                </span>
                                            </span>
                                        </a>
                                    </div>`;
                        },
                    }
                ],
            });
        })

        // handle btn modal zone save
        function modalFormSubmit($form) {
            $('#btn-zone-submit').off().on('click', function (e) {
                e.preventDefault();
                let _form = new FormData($form[0])
                let form_order = parseInt(_form.get("order"))
                let temp = {
                    "order": form_order ? form_order : ZONE_INDEX + 1,
                    "title": _form.get("title"),
                    "remark": _form.get("remark"),
                    "property_list": _form.getAll("property_list")
                }
                if (_form.get('zone_id'))
                    temp['id'] = _form.get('zone_id')
                if (_form.get("order") && _form.get("order") !== undefined) {
                    let rowIdx = form_order - 1
                    $('#table_workflow_zone').DataTable().row(rowIdx).data(temp).draw()
                } else $('#table_workflow_zone').DataTable().row.add(temp).draw()
                $form[0].reset();
                $form.find('.dropdown-select_two').val(null).trigger('change');
                ZONE_INDEX = ZONE_INDEX + 1
                // $(this).closest('.modal').modal('hide')
            });
        }

        // show modal add zone
        $('[data-bs-target="#add_zone"]').on('click', function (e) {
            e.preventDefault();
            let getApp = $select_box.select2('data')
            if (getApp.length === 0) {
                $.fn.notifyPopup({description: $(this).attr('data-required-text')}, 'failure');
                return true
            } else
                $($(this).attr('data-bs-target')).modal('show')
            let $form = $($(this).attr('data-bs-target')).find('form')
            modalFormSubmit($form)
        });

        // handle event on click prev next btn
        $("#nav-next-prev-step button").off().on('click', function (e) {

            // display show hide content of tabs
            e.preventDefault()
            let elmIsActive = $('.nav-workflow-form-tabs li a.active')
            $('.tab-pane').removeClass('show active')
            let btn_href = elmIsActive.parents('li').next().find('a').attr('data-href')
            elmIsActive.removeClass('active')
            if ($(this).attr('data-nav-type') === 'prev') {
                elmIsActive.parents('li').prev().find('a').addClass('active')
                btn_href = elmIsActive.parents('li').prev().find('a').attr('data-href')

                // handle if button prev is last of list nav
                if (btn_href === '#tab_function') $prev_btn.prop('disabled', true)
                $next_btn.prop('disabled', false)
            } else {
                elmIsActive.parents('li').next().find('a').addClass('active')
                // handle if button next is last of list nav
                if (btn_href === '#tab_next_node') $next_btn.prop('disabled', true)
                else $next_btn.prop('disabled', false)
            }
            $(`${btn_href}`).addClass('show active')

            // catch if next tab is display config condition
            if (btn_href === '#tab_next_node') {
                $('#node_dragbox').empty();
                let jsplumb = new JSPlumbsHandle();
                jsplumb.renderAndRerenderDrag();
            }
        })

        //handle event on change function applied
        $select_box.on("select2:select", function (e) {
            $next_btn.prop('disabled', false);
            $next_btn.on('click', () => $prev_btn.prop('disabled', false))
            $('#property_list_choices').attr('data-params', JSON.stringify({application: e.params.data.id}))
        });

        // handle event table zone actions on click
        function actionsClick(elm, data, iEvent) {
            let isACtion = $(iEvent.currentTarget).attr('data-action');
            if (isACtion === 'edit') {
                let $add_zone_modal = $('#add_zone')
                let $form = $add_zone_modal.find('form')
                $form.find('[name="title"]').val(data.title)
                $form.find('[name="remark"]').val(data.remark)
                $form.find('#property_list_choices').val(data.property_list).trigger('change')
                $form.find('[name="order"]').val(data.order)
                if (data.hasOwnProperty('id'))
                    $form.find('[name="zone_id"]').val(data.id)
                modalFormSubmit($form)
                $add_zone_modal.modal('show')
            } else if (isACtion === 'delete') {
                let table_elm = $(elm).parents('table.table');
                $(table_elm).DataTable().rows(elm).remove().draw();
                // .row(elm).index()
                let isDataTableList = $(table_elm).DataTable().data().toArray()
                for (let [idx, item] of isDataTableList.entries()) {
                    item['order'] = idx + 1
                }
                $(table_elm).DataTable().data(isDataTableList).draw(false)
            }
        }

        // action reset default of modal
        $('#id-restore_default').on('change', function () {
            let isChecked = $(this).prop('checked')
            if (isChecked) {
                $('#table_workflow_rename [name*="btn_"]').val('')
            }
        });

        // modal rename button action
        $('#change_btn').on('shown.bs.modal', function () {
            let $this = $(this)
            $('#btn-rename').on('click', function () {
                let btn_data_list = []
                $('#table_workflow_rename [name*="btn_"]').each(function (idx, elm) {
                    if ($(elm).val() !== '') {
                        let temp = {}
                        temp[$(elm).attr('data-key')] = $(elm).val()
                        btn_data_list.push(temp)
                    }
                })
                $('[name="actions_rename"]').val(JSON.stringify(btn_data_list))
                $this.modal('hide')
            });
        })


        // init FlowChart
        const JSPlumbsInit = new JSPlumbsHandle();
        JSPlumbsInit.init();

        // form submit
        $('#btn-create_workflow').on('click', function (e) {
            e.preventDefault()
            let $form = document.getElementById('form-create_workflow')
            let _form = new SetupFormSubmit($('#form-create_workflow'))
            _form.dataForm['zone'] = $('#table_workflow_zone').DataTable().data().toArray()
            let nodeTableData = setupDataNode();
            _form.dataForm['node'] = nodeTableData

            let submitFields = [
                'title',
                'application',
                'node',
                'zone',
                'is_multi_company',
                'is_define_zone',
                'actions_rename'
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


    });
});


function setupDataNode() {
    let dataNodeList = [];
    let tableNode = document.getElementById('datable-workflow-node-create');
    for (let idx = 0; idx < tableNode.tBodies[0].rows.length; idx++) {
        let title = "";
        let description = "";
        let optionCollab = 0;
        let dataActionList = [];
        let dataEmployeeList = [];
        let dataZoneList = [];
        let dataCollaboratorList = [];
        let isSystem = false;
        let codeNodeSystem = "";
        let row = tableNode.rows[idx + 1];
        let rowChildren = row.children;
        for (let d = 0; d < rowChildren.length; d++) {
            let col = rowChildren[d + 1];
            if ((d + 1) === 1) {
                title = col.children[0].innerHTML;
                if (col.children[0].getAttribute('data-is-system')) {
                    if (col.children[0].getAttribute('data-is-system') === "true") {
                        isSystem = true;
                        codeNodeSystem = col.children[0].getAttribute('data-system-code')
                    }
                }
            } else if ((d + 1) === 2) {
                description = col.children[0].innerHTML;
            } else if ((d + 1) === 3) {
                // set data workflow node actions submit
                let eleUL = col.querySelector('.node-action-list');
                if (eleUL) {
                    for (let li = 0; li < eleUL.children.length; li++) {
                        let eleInput = eleUL.children[li].children[1].children[0];
                        let eleDataInput = eleUL.children[li].children[0].children[0].children[0].children[0];
                        if (eleInput.checked === true) {
                            if (eleDataInput.getAttribute('data-action')) {
                                dataActionList.push(Number(eleDataInput.getAttribute('data-action')));
                            }
                        }
                    }
                }
            } else if ((d + 1) === 4) {
                // set data workflow node collaborator submit
                let modalBody = col.querySelector('.modal-body');
                if (modalBody) {
                    if (isSystem === true) {
                        let tableInitialNodeCollaborator = modalBody.querySelector('.table-initial-node-collaborator');
                        if (tableInitialNodeCollaborator) {
                            if (tableInitialNodeCollaborator.tBodies[0].rows.length === 1) {
                                let rowInitialCollab = tableInitialNodeCollaborator.tBodies[0].rows[0];
                                let zoneTd = rowInitialCollab.querySelector('.initial-node-collaborator-zone');
                            }
                        }
                    } else {
                        if (modalBody.children[0].children[1].value) {
                            optionCollab = Number(modalBody.children[0].children[1].value);

                            // if option out form
                            if (optionCollab === 1) {
                                let auditOutFormEmployeeEle = modalBody.querySelector('.audit-out-form-employee-data-show');
                                let eleDiv = auditOutFormEmployeeEle.children;
                                if (eleDiv.length > 0) {
                                    for (let d = 0; d < eleDiv.length; d++) {
                                        let auditOutFormEmployeeShow = eleDiv[d].children;
                                        for (let s = 0; s < auditOutFormEmployeeShow.length; s++) {
                                            let empID = auditOutFormEmployeeShow[s].children[0].value;
                                            dataEmployeeList.push(empID);
                                        }
                                    }
                                }
                                let zone = modalBody.children[2].querySelector('.zone-data-show');
                                if (zone.children.length > 0) {
                                    for (let d = 0; d < zone.children.length; d++) {
                                        if (zone.children[d].children.length > 0) {
                                            for (let z = 0; z < zone.children[d].children.length; z++) {
                                                dataZoneList.push(Number(zone.children[d].children[z].children[0].value));
                                            }
                                        }
                                    }
                                }
                                // option in workflow
                            } else if (optionCollab === 2) {
                                let tableDataShowId = modalBody.querySelector('.table-in-workflow-employee').id;
                                let table = document.getElementById(tableDataShowId);
                                for (let r = 0; r < table.tBodies[0].rows.length; r++) {
                                    let dataZoneInWorkflowList = []
                                    let row = table.rows[r + 1];
                                    let employee = row.querySelector('.data-in-workflow-employee').value;

                                    let zoneTd = row.querySelector('.data-in-workflow-zone');
                                    if (zoneTd.children.length > 0) {
                                        for (let col = 0; col < zoneTd.children.length; col++) {
                                            if (zoneTd.children[col].children.length > 0) {
                                                for (let s = 0; s < zoneTd.children[col].children.length; s++) {
                                                    let zoneVal = zoneTd.children[col].children[s].children[0].value;
                                                    dataZoneInWorkflowList.push(Number(zoneVal))
                                                }
                                            }
                                        }
                                    }
                                    dataCollaboratorList.push({
                                        'employee': employee,
                                        'collaborator_zone': dataZoneInWorkflowList,
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }
        dataNodeList.push({
            'title': title,
            'description': description,
            'actions': dataActionList,
            'option_collaborator': optionCollab,
            'collaborator_list': dataEmployeeList,
            'node_zone': dataZoneList,
            'collaborator': dataCollaboratorList,
            'is_system': isSystem,
            'code_node_system': codeNodeSystem
        });
    }
    return dataNodeList
}

