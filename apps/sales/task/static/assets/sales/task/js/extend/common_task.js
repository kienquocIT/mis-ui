class labelHandle {
    deleteLabel(elm) {
        elm.find('.tag-delete').on('click', function (e) {
            const $taskLabelElm = $('#inputLabel')
            e.stopPropagation();
            const selfTxt = $(this).prev().text();
            elm.remove();
            let labelList = JSON.parse($taskLabelElm.val())
            const idx = labelList.indexOf(selfTxt)
            if (idx > -1) labelList.splice(idx, 1)
            $taskLabelElm.attr('value', JSON.stringify(labelList))
        })
    }

    renderLabel(list) {
        // reset empty
        let htmlElm = $('.label-mark')
        htmlElm.html('')
        for (let item of list) {
            const labelHTML = $(`<span class="item-tag"><span>${item}</span><span class="tag-delete">x</span></span>`)
            htmlElm.append(labelHTML)
            this.deleteLabel(labelHTML)
        }
    }

    // on click add label
    addLabel() {
        const $taskLabelElm = $('#inputLabel')
        const _this = this
        $('.form-tags-input-wrap .btn-add-tag').on('click', function () {
            const $elmInputLabel = $('#inputLabelName')
            const newTxt = $elmInputLabel.val()
            let labelList = $taskLabelElm.attr('value')
            if (labelList !== undefined && labelList !== '') labelList = JSON.parse(labelList)
            else labelList = []
            labelList.push(newTxt)
            $taskLabelElm.attr('value', JSON.stringify(labelList))
            const labelHTML = $(`<span class="item-tag"><span>${newTxt}</span><span class="tag-delete">x</span></span>`)
            $('.label-mark').append(labelHTML)
            $elmInputLabel.val('')
            _this.deleteLabel(labelHTML)
        })
    }

    showDropdown() {
        $('.label-mark').off().on('click', function () {
            const isParent = $(this).parent('.dropdown')
            isParent.children().toggleClass('show')
            $('input', isParent).focus()
        });
        $('.form-tags-input-wrap .btn-close-tag').on('click', function () {
            $(this).parents('.dropdown').children().removeClass('show')
        })
    }

    init() {
        this.showDropdown()
        this.addLabel()
    }
}

class checklistHandle {
    datalist = []

    set setDataList(data) {
        this.datalist = data;
    }

    render() {
        let $elm = $('.wrap-checklist')
        $elm.html('')
        for (const item of this.datalist) {
            let html = $($('.check-item-template').html())
            // html.find
            html.find('label').text(item.name)
            html.find('input').prop('checked', item.done)
            $elm.append(html)
            html.find('label').focus()
            this.delete(html)
        }
    }

    delete(elm) {
        elm.find('button').off().on('click', () => elm.remove())
    }

    get() {
        let checklist = []
        $('.wrap-checklist .checklist_item').each(function () {
            checklist.push({
                'name': $(this).find('label').text(),
                'done': $(this).find('input').prop('checked')
            })
        })
        return checklist
    }

    add() {
        const _this = this;
        $('.create-checklist').off().on('click', function () {
            let html = $($('.check-item-template').html())
            // html.find
            $('.wrap-checklist').append(html)
            html.find('label').focus(function () {
                $(this).select();
            });
            _this.delete(html)
        });
    }

    init() {
        this.add()
    }
}

function logworkSubmit() {
    $('#save-logtime').off().on('click', function () {
        document.activeElement.blur();
        const startDate = $('#startDateLogTime').val()
        const endDate = $('#endDateLogTime').val()
        const est = $('#EstLogtime').val()
        const taskID = $('#logtime_task_id').val()
        if (!startDate || !endDate || !est) {
            $.fn.notifyB({description: $('#form_valid').attr('data-logtime-valid')}, 'failure')
            return false
        }
        const data = {
            'start_date': startDate,
            'end_date': endDate,
            'time_spent': est,
        }
        // if has task id => log time
        if (taskID && taskID.valid_uuid4()) {
            data.task = taskID
            let url = $('#url-factory').attr('data-logtime')
            $.fn.callAjax2({
                'url': url,
                'method': 'POST',
                'data': data
            })
                .then(
                    (req) => {
                        let data = $.fn.switcherResp(req);
                        if (data?.['status'] === 200) {
                            $.fn.notifyB({description: data.message}, 'success')
                        }
                    },
                    (err) => $.fn.notifyB({description: err.data.errors}, 'failure')
                )
        } else {
            $('[name="log_time"]').attr('value', JSON.stringify(data))
        }
        $('#logWorkModal').modal('hide')
    });
}

function loadDetailTask(data, initCommon, _this){
    const $canvasElm = $('#offCanvasRightTask');
    const $prjElm = $('form #project_id', $canvasElm)
    const $oppElm = $('form #opportunity_id', $canvasElm)
    const $empElm = $('form #employee_inherit_id', $canvasElm)

    $canvasElm.offcanvas('show');
    const titCreate = $('.title-create');
    const titEdit = $('.title-detail');
    titCreate.addClass("hidden")
    titEdit.removeClass("hidden")
    const taskIDElm = $(`<input type="hidden" name="id" value="${data.id}"/>`)
    $('form', $canvasElm).append(taskIDElm).attr('data-id-loaded', data.id).addClass('task_edit');
    $('#inputTextTitle').val(data.title)
    $('#inputTextCode').val(data.code)
    $('#selectStatus').attr('data-onload',
        JSON.stringify(data.task_status)).initSelect2().val(data.task_status?.id).trigger('change')
    $('#inputTextStartDate')[0]._flatpickr.setDate(data.start_date)
    $('#inputTextEndDate')[0]._flatpickr.setDate(data.end_date)
    $('#inputTextEstimate').val(data.estimate)
    $('#selectPriority').val(data.priority).trigger('change')
    $('#rangeValue').text(data['percent_completed'])
    $('#percent_completed').val(data['percent_completed'])
    window.formLabel.renderLabel(data.label)
    $('#inputLabel').attr('value', JSON.stringify(data.label))
    $('#inputAssigner')
        .val(data.employee_created.full_name)
        .attr('data-name', data.employee_created.full_name)
        .attr('value', data.employee_created.id)
        .attr('data-value-id', data.employee_created.id)
    if ($('#employee_inherit_id')[0].closest('#formOpportunityTask')) {
        const runComponent = (elm, data) => {
            data.selected = true;
            elm.attr('data-onload', JSON.stringify(data))
                .html(`<option value="${data.id}" selected>${data.title}</option>`)
                .trigger('change')
        }
        if (data?.['process'] && data?.['process']?.['id']) {
            const {process} = data;
            runComponent($('#process_id'), process)
        }
        else if (data['opportunity'] && Object.keys(data["opportunity"]).length > 0) {
            const {opportunity} = data
            $prjElm.attr('disabled', true)
            runComponent($oppElm, opportunity)
        }
        else if (data['project'] && Object.keys(data["project"]).length > 0) {
            const {project} = data;
            $oppElm.attr('disabled', true);
            runComponent($prjElm, project)
        }
        if (Object.keys(data.employee_inherit).length > 0) {
            data.employee_inherit.selected = true
            $empElm.html(`<option value="${data.employee_inherit.id}">${data.employee_inherit.full_name}</option>`)
                .attr('data-onload', JSON.stringify(data.employee_inherit))
            $empElm.trigger("change", BastionFieldControl.skipBastionChange)
        }
    }
    const $agElm = $('#assignee_group')
    if (data?.['group_assignee'] && $agElm.length && Object.keys(data?.['group_assignee']).length) {
        data.group_assignee.selected = true
        FormElementControl.loadInitS2($agElm, [data.group_assignee]);
    }
    let $customAssignee = $('#custom_assignee');
    if ($customAssignee.length > 0) {
        FormElementControl.loadInitS2($customAssignee, [data?.['employee_inherit']]);
    }
    window.editor.setData(data.remark)
    window.checklist.setDataList = data.checklist
    window.checklist.render()
    if (Object.keys(data.parent_n).length <= 0)
        $('.create-subtask').removeClass('hidden')
    else
        $('.create-subtask').addClass('hidden')
    initCommon.initTableLogWork(data?.['task_log_work'])
    initCommon.renderSubtask(data.id, _this.getTaskList, data['sub_task_list'])

    if (data.attach) {
        let $elmAttAssign = $('#assigner_attachment'),
            _lstAssigner = data.attach.filter(function (item) {
                return item['is_assignee_file'] === false;
            }),
            _lstAssignee = data.attach.filter(function (item) {
                return item['is_assignee_file'] === true;
            });
        // load attachments of assigner
        $elmAttAssign.find('.dm-uploader').dmUploader("destroy")
        new $x.cls.file(
            $elmAttAssign
        ).init({
            enable_edit: true,
            data: _lstAssigner,
        })

        // load attachment if assignee
        let $elmAttachAssignee = $('#assignee_attachment')
        $elmAttachAssignee.find('.dm-uploader').dmUploader("destroy")
        new $x.cls.file(
            $elmAttachAssignee
        ).init({
            enable_edit: true,
            data: _lstAssignee,
        })
    }
}
// logic of task extend to other apps
class TaskExtend {

    static renderTaskTblRow() {
        return `<div class="d-flex align-items-center justify-content-between">
                    <button 
                        type="button" 
                        class="btn btn-icon btn-rounded btn-soft-primary btn-xs btn-open-task"
                        data-bs-toggle="tooltip" data-bs-placement="bottom" title="Add new task"
                    >
                        <span class="icon"><i class="fa-solid fa-plus"></i></span>
                    </button>
                    <input type="text" class="form-control table-row-task-data hidden">
                    <div class="d-flex align-items-center">
                        <div class="avatar-group avatar-group-overlapped avatar-group-task"></div>
                        <button 
                            type="button" 
                            class="btn btn-icon btn-rounded btn-soft-secondary btn-xs btn-list-task"
                            data-bs-toggle="tooltip" data-bs-placement="bottom" title="Task assigned list"
                        >
                            <span class="icon"><i class="fas fa-ellipsis-h"></i></span>
                        </button>
                    </div>
                </div>`;
    };

    static openAddTaskFromTblRow(ele, $table) {
        let $canvasEle = $('#offCanvasRightTask');
        let row = ele.closest('tr');
        let rowIndex = $table.DataTable().row(row).index();
        $canvasEle.attr('data-tbl-id', $table[0].id);
        $canvasEle.attr('data-row-idx', rowIndex);
        $canvasEle.offcanvas('show');
        return true;
    };

    static openListTaskFromTblRow(ele, $table) {
        let $modalEle = $('#listTaskAssignedModal');
        let row = ele.closest('tr');
        let rowIndex = $table.DataTable().row(row).index();
        $modalEle.attr('data-tbl-id', $table[0].id);
        $modalEle.attr('data-row-idx', rowIndex);
        $modalEle.modal('show');
        return true;
    };

    static getTaskIDsFromTbl($table) {
        let taskIDs = [];
        $table.DataTable().rows().every(function () {
            let row = this.node();
            let taskDataEle = row.querySelector('.table-row-task-data');
            if (taskDataEle) {
                if ($(taskDataEle).val()) {
                    let taskData = JSON.parse($(taskDataEle).val());
                    for (let task of taskData) {
                        if (task?.['id']) {
                            taskIDs.push(task?.['id']);
                        }
                    }
                }
            }
        });
        return taskIDs;
    };

    static storeData(formData, row) {
        let taskDataEle = row.querySelector('.table-row-task-data');
        let taskData = [];
        let taskCheck = [];
        // update task data
        if (taskDataEle) {
            if ($(taskDataEle).val()) {
                taskData = JSON.parse($(taskDataEle).val());
                for (let task of taskData) {
                    taskCheck.push(task?.['id']);
                }
            }
            if (!taskCheck.includes(formData?.['id'])) {
                taskData.push(formData);
                $(taskDataEle).val(JSON.stringify(taskData));
            }
        }
        return taskData;
    };

    static renderTaskAvatarTblRow(taskData, row) {
        let avaGrTaskEle = row.querySelector('.avatar-group-task');
        if (avaGrTaskEle && taskData) {
            let avatarsEle = ``;
            let count = 0;
            let color = ['red', 'blue', 'yellow', 'green', 'pink', 'purple', 'violet', 'indigo', 'sky', 'cyan', 'teal', 'neon', 'lime', 'sun', 'orange'];
            for (let task of taskData) {
                let randomColor = color[Math.floor(Math.random() * color.length)];
                avatarsEle += `<div class="avatar avatar-xs avatar-${randomColor} avatar-rounded" data-bs-toggle="tooltip" data-bs-placement="bottom" title="${task?.['employee_inherit']?.['full_name']}">
                                    <span class="initial-wrap text-white">${task?.['employee_inherit']?.['first_name'].charAt(0).toUpperCase()}</span>
                                </div>`;
                count++;
                if (count === 3) {
                    break;
                }
            }
            $(avaGrTaskEle).empty();
            $(avaGrTaskEle).html(avatarsEle);
        }
        return true;
    };

    static calculatePercentCompletedAll(taskDatas) {
        if (!taskDatas.length) return 0;
        let total = taskDatas.reduce((sum, task) => sum + task?.['percent_completed'], 0);
        return Math.round(total / taskDatas.length);
    }

    static delTaskFromDelRow(ele) {
        let row = ele.closest('tr');
        let taskIDEle = row.querySelector('.table-row-task-id');
        if (taskIDEle) {
            if ($(taskIDEle).val()) {
                let $kbScrollEle = $('#kb_scroll');
                if ($kbScrollEle.length > 0) {
                    let titleEle = $kbScrollEle[0].querySelector(`.card-title[data-task-id="${$(taskIDEle).val()}"]`);
                    if (titleEle) {
                        let taskListEle = titleEle.closest('.tasklist');
                        if (taskListEle) {
                            let delEle = taskListEle.querySelector('.del-task-act');
                            if (delEle) {
                                $(delEle).trigger('click');
                            }
                        }
                    }
                }
            }
        }
        return true;
    };

}

$(document).ready(function(){
    const $ElmGrpTit = $('#group_title')
    const $ElmGrpLst = $('#group_assignee_list')
    const $ElmModal = $('#modalAssigneeGroup')
    const $isHasGroup = $('#has_group_assignee')

    if ($isHasGroup.length){
        const $taskForm = $('#formOpportunityTask');
        let htmlSlt = '<div class="col-xs-12 wrap_employee_group">' +
            '<div class="form-group">' +
            `<label for="assignee_group" class="form-label">${$.fn.gettext('Assignee group')}</label>` +
            '<select id="assignee_group" class="form-select" name="assignee_group"></select>' +
            '</div>' +
            '</div>';

        $taskForm.find('.wrap_task_inherit').append(htmlSlt)
        $('#assignee_group').initSelect2({
            ajax: {
                url: $ElmModal.attr('data-url'),
                method: 'GET',
            },
            keyId: 'id',
            keyText: 'title',
            keyResp: 'list_assignee_group',

        })
    }

    // load selected assignee
    $ElmGrpLst.initSelect2().on('select2:select', function(e){
        const data = $(this).data('group_lst') || {}
        data[e.params.data.id] = {
            "id": e.params.data.id,
            "full_name": e.params.data.data.full_name,
        }
        if (e.params.data.data.group)
            data[e.params.data.id].group = {
                "id": e.params.data.data.group.id,
                "title": e.params.data.data.group.title
            }
        $(this).data('group_lst', data)
    }).on('select2:unselect', function(e){
        const data = $(this).data('group_lst') || {}
        delete data[e.params.data.id]
    })

    // handle btn save group
    $ElmModal.find('#save_group').on('click', function(){
        const $btn = $(this);
        // Prevent double-click
        if ($btn.prop('disabled')) return;
        $btn.prop('disabled', true);

        const dataGroup = {
            'title': $ElmGrpTit.val(),
            'employee_list_access': $ElmGrpLst.data('group_lst')
        }
        if (dataGroup?.title && dataGroup?.employee_list_access){
            $.fn.callAjax2({
                'url': $ElmModal.attr('data-url'),
                'method': 'post',
                'data': dataGroup,
                'sweetAlertOpts': {'allowOutsideClick': true}
            }).then((req) => {
                let data = $.fn.switcherResp(req);
                if (data && (data['status'] === 201 || data['status'] === 200)) {
                    $.fn.notifyB({description: data.message}, 'success');
                    // hidden modal
                    $ElmModal.modal('hide')
                    // reset data form
                    $ElmGrpLst.data('group_lst', {})
                        .val('').trigger('change')
                    $ElmGrpTit.val('')
                }
            }).finally(() => {
                // Re-enable button after request completes
                $btn.prop('disabled', false);
            })
        }
        else{
            // Re-enable button if validation fails
            $btn.prop('disabled', false);
        }
    })
});