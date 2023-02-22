"use strict";
var ZONEINDEX = 0;
$(function () {

    $(document).ready(function () {
        // declare global scope variable
        let $prev_btn = $('#nav-next-prev-step .prev-btn');
        let $next_btn = $('#nav-next-prev-step .next-btn');

        // init select function applied
        let $select_box = $("#select-box-features");
        let selectURL = $select_box.attr('data-url')
        $select_box.select2({
            ajax:{
                url: selectURL,
                processResults: function (res) {
                    let data_original = res.data[$select_box.attr('data-prefix')];
                    let data_convert = []
                    if (data_original.length){
                        for (let item of data_original){
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
        let $tables = $('.table');
        $tables.each(function () {
            let $elm = $(this);
            $elm.DataTable({
                searching: false,
                ordering: false,
                paginate: false,
                info: false,
                drawCallback: function () {
                    // render icon after table callback
                    feather.replace();
                },
                rowCallback: function (row, data) {
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
                            let str_html = `<div>
                                                <a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button"
                                                   data-bs-toggle="tooltip"
                                                   data-bs-placement="top"
                                                   title=""
                                                   data-bs-original-title="Edit"
                                                   href="#"
                                                   data-id="${row.id}">
                                                    <span class="btn-icon-wrap btn-open-power-user-info"
                                                          data-bs-toggle="modal"
                                                          data-bs-target="#power_user_info">
                                                        <span class="feather-icon">
                                                            <i data-feather="edit"></i>
                                                        </span>
                                                    </span>
                                                </a>
                                            </div>`;
                            return str_html
                        },
                    }
                ],
            });
        })

        // handle modal is show
        $('#add_zone').on('shown.bs.modal', function (e) {
            let $form = $(this).find('form')
            $('#btn-zone-submit').off().on('click', function (e) {
                let _form = new FormData($form[0])
                let temp = {
                    "order": ZONEINDEX + 1,
                    "title": _form.get("title"),
                    "remark": _form.get("remark"),
                    "property_list": _form.getAll("property_list")
                }
                $('#table_workflow_zone').DataTable().row.add(temp).draw()
                $form[0].reset();
                ZONEINDEX = ZONEINDEX + 1
                $(this).closest('.modal').modal('hide')
            })
        });

        // handle event on click prev next btn
        $("#nav-next-prev-step button").off().on('click', function (e) {
            e.preventDefault()
            let elmIsActive = $('.nav-workflow-form-tabs li a.active')
            $('.tab-pane').removeClass('show active')
            let btn_href = elmIsActive.parents('li').next().find('a').attr('data-href')
            elmIsActive.removeClass('active')
            if ($(this).attr('data-nav-type') === 'prev'){
                elmIsActive.parents('li').prev().find('a').addClass('active')
                btn_href = elmIsActive.parents('li').prev().find('a').attr('data-href')

                // handle if button prev is last of list nav
                if(btn_href === '#tab_function') $prev_btn.prop('disabled', true)
                $next_btn.prop('disabled', false)
            }
            else {
                elmIsActive.parents('li').next().find('a').addClass('active')
                // handle if button next is last of list nav
                if(btn_href === '#tab_next_node') $next_btn.prop('disabled', true)
                else $next_btn.prop('disabled', false)
            }
            $(`${btn_href}`).addClass('show active')


        })

        //handle event on change function applied
        $select_box.on("select2:select", function (e) {
            $next_btn.prop('disabled', false);
            $next_btn.on('click', (e) => $prev_btn.prop('disabled', false))
        });

        // form submit
        $('#btn-create_workflow').on('click', function (e) {
            let $form = document.getElementById('form-create_workflow')
            let _form = new SetupFormSubmit($('#form-create_workflow'))
            let zoneTableData = $('#table_workflow_zone').DataTable().data().toArray()
            _form.dataForm['zone'] = zoneTableData
            let nodeTableData = setupDataNode();
            _form.dataForm['node'] = nodeTableData

            let csr = $("[name=csrfmiddlewaretoken]").val()

            $.fn.callAjax(_form.dataUrl, _form.dataMethod, _form.dataForm, csr)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            // $.fn.notifyPopup({description: "Group is being created"}, 'success')
                            $.fn.redirectUrl($($form).attr('data-url-redirect'), 3000);
                        }
                    },
                    (errs) => {
                        $.fn.notifyPopup({description: "Group create fail"}, 'failure')
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
        let dataNode = {};
        let dataActionList = [];
        let dataEmployeeList = [];
        let dataZoneList = [];
        let dataCollaboratorList = [];
        let row = tableNode.rows[idx+1];
        let rowChildren = row.children;
        for (let d = 0; d < rowChildren.length; d++) {
            let col = rowChildren[d + 1];
            if ((d + 1) === 1) {
                title = col.children[0].innerHTML;
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
                dataNode['actions'] = dataActionList;
            } else if ((d + 1) === 4) {
                // set data workflow node collaborator submit
                let modalBody = col.querySelector('.modal-body');
                if (modalBody) {
                    if (modalBody.children[0].children[1].value) {
                        let optionCollab = Number(modalBody.children[0].children[1].value);
                        dataNode['option_collaborator'] = optionCollab;

                        // if option audit === 1
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
                            dataNode['employee_list'] = dataEmployeeList
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
                            dataNode['node_zone'] = dataZoneList;

                        } else if (optionCollab === 2) {
                            let tableDataShowId = modalBody.querySelector('.table-in-workflow-employee').id;
                            let table = document.getElementById(tableDataShowId);
                            for (let r = 0; r < table.tBodies[0].rows.length; r++) {
                                let dataCollaborator = {};
                                let dataZoneInWorkflowList = []
                                let row = table.rows[r+1];
                                let employee = row.querySelector('.data-in-workflow-employee').value;
                                dataCollaborator['employee'] = employee;

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
                                    dataCollaborator['zone'] = dataZoneInWorkflowList;
                                }
                                dataCollaboratorList.push({
                                    'employee': employee,
                                    'zone': dataZoneInWorkflowList,
                                });
                            }
                            dataNode['collaborator'] = dataCollaboratorList;
                        }
                    }
                }
            }
        }
        dataNodeList.push({
                'title': title,
                'description': description,
                'actions': dataActionList,
                'employee_list': dataEmployeeList,
                'node_zone': dataZoneList,
                'collaborator': dataCollaboratorList
            });
    }
    return dataNodeList
}