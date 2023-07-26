let ZONE_INDEX = 0;
let WF_DATATYPE = [];

function getZone(zoneList) {
    let dataZoneList = [];
    if (zoneList) {
        for (let z = 0; z < zoneList.children.length; z++) {
            let dataZone = zoneList.children[z].querySelector('.node-zone').getAttribute('data-node-zone');
            let inputCheck = zoneList.children[z].querySelector('.check-zone-node');
            if (inputCheck.checked === true && dataZone) {
                if (dataZone !== "all") {
                    dataZoneList.push(Number(dataZone))
                }
            }
        }
    }
    return dataZoneList;
}

function setupDataNode(is_submit = false) {
    let dataNodeList = [];
    let tableNode = document.getElementById('datable-workflow-node-create');
    for (let idx = 0; idx < tableNode.tBodies[0].rows.length; idx++) {
        let title = "";
        let description = "";
        let optionCollab = 0;
        let dataActionList = [];
        let dataEmployeeList = [];
        let dataZoneList = [];
        let dataInitialZoneList = [];
        let isSystem = false;
        let codeNodeSystem = "";
        let total_collaborator_in_process = 1;
        let total_collaborator_config = 1;
        let orderNode = 0;
        let fieldSelectCollaborator = "";
        let coordinates = {};
        let condition = [];

        let collabInForm = {};
        let collabOutForm = {};
        let collabInWorkflow = [];

        let row = tableNode.rows[idx + 1];
        if (row.getAttribute('data-initial-check-box')) {
            orderNode = Number(row.getAttribute('data-initial-check-box'))
        }
        let rowChildren = row.children;
        for (let d = 0; d < rowChildren.length; d++) {
            let col = rowChildren[d + 1];
            if ((d + 1) === 1) {
                title = col.querySelector('.node-title').innerHTML;
                let coordinatesRaw = col.querySelector('.node-title').getAttribute('data-coordinates');
                if (coordinatesRaw) {
                    coordinates = JSON.parse(coordinatesRaw)
                }
                let conditionRaw = col.querySelector('.node-title').getAttribute('data-condition');
                if (conditionRaw) {
                    condition = JSON.parse(conditionRaw)
                }
                if (col.children[0].getAttribute('data-is-system')) {
                    if (col.children[0].getAttribute('data-is-system') === "true") {
                        isSystem = true;
                        codeNodeSystem = col.children[0].getAttribute('data-system-code')
                    }
                }
            } else if ((d + 1) === 2) {
                description = col.querySelector('.node-description').innerHTML;
            } else if ((d + 1) === 3) {
                // check Status Node when submit
                if (is_submit === true) {
                    let statusFail = col.querySelector('.fa-times');
                    if (statusFail) {
                        return false
                    }
                }
                // set data workflow node actions submit
                let eleUL = col.querySelector('.node-action-list');
                if (eleUL) {
                    for (let li = 0; li < eleUL.children.length; li++) {
                        let eleInput = eleUL.children[li].querySelector('.check-action-node');
                        let eleDataInput = eleUL.children[li].querySelector('.node-action').getAttribute('data-action');
                        if (eleInput.checked === true) {
                            dataActionList.push(Number(eleDataInput));
                        }
                    }
                }
            } else if ((d + 1) === 4) {
                if (is_submit === true) {
                    let statusFail = col.querySelector('.fa-times');
                    if (statusFail) {
                        return false
                    }
                }
                // set data workflow node collaborator submit
                let modalBody = col.querySelector('.modal-body');
                if (modalBody) {
                    if (isSystem === true) {
                        let tableInitialNodeCollab = modalBody.querySelector('.table-initial-node-collaborator');
                        if (tableInitialNodeCollab) {
                            if (tableInitialNodeCollab.tBodies[0].rows.length > 0) {
                                let zoneList = tableInitialNodeCollab.tBodies[0].rows[0].querySelector('.node-zone-list');
                                dataInitialZoneList = getZone(zoneList)
                            }
                        }
                    } else {
                        if (modalBody.children[0].children[1].value) {
                            optionCollab = Number(modalBody.children[0].children[1].value);

                            // if option in form
                            if (optionCollab === 0) {
                                let zoneList = modalBody.children[2].querySelector('.node-zone-list');
                                dataZoneList = getZone(zoneList);
                                let eleProperty = modalBody.querySelector('.select-box-audit-in-form-property');
                                if (eleProperty) {
                                    fieldSelectCollaborator = eleProperty.value;
                                }
                                collabInForm['property'] = fieldSelectCollaborator;
                                collabInForm['zone'] = dataZoneList;
                            }

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

                                let zoneList = modalBody.children[2].querySelector('.node-zone-list');
                                dataZoneList = getZone(zoneList);
                                total_collaborator_in_process = dataEmployeeList.length
                                collabOutForm['employee_list'] = dataEmployeeList;
                                collabOutForm['zone'] = dataZoneList;
                                // if option in workflow
                            } else if (optionCollab === 2) {
                                let tableDataShowId = modalBody.querySelector('.table-in-workflow-employee').id;
                                let table = document.getElementById(tableDataShowId);
                                for (let r = 0; r < table.tBodies[0].rows.length; r++) {
                                    let dataZoneInWorkflowList = [];
                                    let employee = null;
                                    let row = table.rows[r + 1];
                                    if (row.querySelector('.data-in-workflow-employee')) {
                                        employee = row.querySelector('.data-in-workflow-employee').value;
                                    }
                                    let zoneTd = row.querySelector('.data-in-workflow-zone');
                                    if (zoneTd.children.length > 0) {
                                        for (let col = 0; col < zoneTd.children.length; col++) {
                                            let zoneInWorkflow = zoneTd.children[col].querySelector('.zone-in-workflow-id');
                                            if (zoneInWorkflow) {
                                                let zoneVal = zoneInWorkflow.value;
                                                dataZoneInWorkflowList.push(Number(zoneVal))
                                            }
                                        }
                                    }
                                    if (employee) {
                                        collabInWorkflow.push({
                                            'employee': employee,
                                            'zone': dataZoneInWorkflowList,
                                        })
                                    }
                                }
                                total_collaborator_in_process = collabInWorkflow.length;
                                total_collaborator_config = collabInWorkflow.length;
                            }
                        }
                    }
                }
            }
        }
        if (is_submit === true) {
            dataNodeList.push({
                'title': title,
                'description': description,
                'actions': dataActionList,
                'option_collaborator': optionCollab,
                'collab_in_form': collabInForm,
                'collab_out_form': collabOutForm,
                'collab_in_workflow': collabInWorkflow,
                'zone_initial_node': dataInitialZoneList,
                'is_system': isSystem,
                'code_node_system': codeNodeSystem,
                'order': orderNode
            });
        } else {
            dataNodeList.push({
                'order': orderNode,
                'title': title,
                'remark': description,
                'action': dataActionList,
                'collaborators': {
                    'option': optionCollab,
                    'total_in_process': total_collaborator_in_process,
                    'total_config': total_collaborator_config,
                },
                'is_system': isSystem,
                'code_node_system': codeNodeSystem,
                'check_approved': '',
                'coordinates': coordinates,
                'condition': condition
            });
        }
    }
    return dataNodeList
}

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

function addZoneBtn(ElmSelectbox) {
    // show modal add zone
    $('[data-bs-target="#add_zone"]').on('click', function (e) {
        e.preventDefault();
        let getApp = ElmSelectbox.select2('data')
        if (getApp.length === 0) {
            $.fn.notifyB({description: $(this).attr('data-required-text')}, 'failure');
            return true
        } else
            $($(this).attr('data-bs-target')).modal('show')
        let $form = $($(this).attr('data-bs-target')).find('form')
        modalFormSubmit($form)
    });
}

// handle event table zone actions on click
function actionsClick(elm, data, iEvent) {
    let isAction = $(iEvent.currentTarget).attr('data-action');
    if (isAction === 'edit') {
        let $add_zone_modal = $('#add_zone');
        let $form = $add_zone_modal.find('form');
        $form.find('[name="title"]').val(data.title)
        $form.find('[name="remark"]').val(data.remark)
        $form.find('#property_list_choices').val(data.property_list).trigger('change')
        $form.find('[name="order"]').val(data.order)
        if (data.hasOwnProperty('id'))
            $form.find('[name="zone_id"]').val(data.id)
        modalFormSubmit($form)
        $add_zone_modal.modal('show')
    } else if (isAction === 'delete') {
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

function initTableZone(data) {
    // init dataTable
    let listData = data ? data : []
    let $tables = $('#table_workflow_zone');
    $tables.DataTable({
        data: listData,
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
                    let disabled = '';
                    const isReadonly = $('#form-detail_workflow').attr('readonly')
                    if (isReadonly === 'readonly') disabled = 'disabled'
                    return `<div class="actions-btn">
                                    <a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button ${disabled}"
                                       title="Edit"
                                       href="#"
                                       data-id="${_id}"
                                       data-action="edit">
                                        <span class="feather-icon">
                                            <i data-feather="edit"></i>
                                        </span>
                                    </a>
                                    <a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover delete-btn ${disabled}"
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
}

$(document).ready(function () {
    // declare global scope variable
    let $prev_btn = $('#nav-next-prev-step .prev-btn');
    let $next_btn = $('#nav-next-prev-step .next-btn');
    let $select_box = $("#select-box-features");
    WF_DATATYPE = JSON.parse($('#wf_data_type').text());

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
        }
        else {
            elmIsActive.parents('li').next().find('a').addClass('active')
            // handle if button next is last of list nav
            if (btn_href === '#tab_next_node') $next_btn.prop('disabled', true)
            else $next_btn.prop('disabled', false)
            $prev_btn.prop('disabled', false)
        }
        $(`${btn_href}`).addClass('show active')

        // catch if next tab is display config condition
        if (btn_href === '#tab_next_node') {
            FlowJsP.init()
        } else if (btn_href === '#tab_node') {
            loadZoneInitialNode()
        }
    })

    //handle event on change function applied
    $select_box.on("select2:select", function (e) {
        $next_btn.prop('disabled', false);
        $next_btn.on('click', () => $prev_btn.prop('disabled', false))
        $('#property_list_choices').attr('data-params', JSON.stringify({application: e.params.data.id}))
    });

    // button create new zone
    addZoneBtn($select_box)

    // action reset default of modal
    $('#id-restore_default').on('change', function () {
        let isChecked = $(this).prop('checked')
        if (isChecked) $('#table_workflow_rename [name*="btn_"]').val('');
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
})