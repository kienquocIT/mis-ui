$(function () {
    "use strict";
    // declare variable
    const $urlFact = $('#url-factory');
    const priority_list = {
        0: 'success',
        1: 'warning',
        2: 'danger'
    }
    const $createBtn = $('.create-task')
    const $formElm = $('#formOpportunityTask')
    const $oppElm = $('#opportunity_id')
    const $empElm = $('#employee_inherit_id')
    let $contentElm = $('#idxPageContent');

    // lấy danh sách status và render
    function getSttAndRender() {
        let $taskConfig =  $('#task_config').text()
        const config = $taskConfig ? JSON.parse($taskConfig) : {};
        if (!config?.['list_status']) return false
        // to do item

        for (const item of config?.list_status) {
            let stt_template = $($('.card-parent_template').html());
            // for kanban main task
            stt_template.find('.btn-add-newtask').attr('data-id', item.id)
            stt_template.find('.tasklist-name').text(item.name).css('background-color', item.task_color)
            stt_template.find('.task-count').text(0)
            stt_template.find('.wrap-child').attr('id', `taskID-${item.id}`)
            $('#tasklist_wrap').append(stt_template)
            // create new task with default task status
            stt_template.find('.btn-add-newtask').off().on('click', function () {
                const currentData = {
                    'id': item.id,
                    'title': item.name,
                    'selected': true
                }
                $('#offCanvasRightTask').offcanvas('show')
                let createFormTask = setInterval(function () {
                    clearInterval(createFormTask)
                    const $sttElm = $('#selectStatus')
                    $sttElm.attr('data-onload', JSON.stringify(currentData))
                    $sttElm.html('');
                    $sttElm.initSelect2()
                }, 1000)

            })

            // for kanban sub-task
            let cloneHTML = stt_template.clone()
            cloneHTML.find('.card-header').addClass('hidden')
            cloneHTML.find('.wrap-child').attr('id', `sub-taskID-${item.id}`)
            $('#sub-tasklist_wrap').append(cloneHTML)

            if (item.name.toLowerCase() === 'to do' && item['is_edit'] === false && item.is_finish === false) {
                item.selected = true
                item.title = item.name
                $('#selectStatus').attr('data-onload', JSON.stringify(item)).data('default-stt', item)
                // .initSelect2()
                let createFormTask1 = setInterval(function () {
                    clearInterval(createFormTask1)
                    const $sttElm = $('#selectStatus')
                    $sttElm.initSelect2()
                }, 1000)
            }
        }
    }

    function countSTT() {
        $('#tasklist_wrap .tasklist').each(function () {
            const item = $('.wrap-child .tasklist-card', $(this)).length
            $(this).find('.task-count').text(item)
        })
    }

    function InitActionClickBtn(){
        const $assignToMe = $('.received-task a')
        $assignToMe.on('click', function (e) {
            const _this = $(this)
            e.preventDefault()
            $.fn.callAjax2({
                'url': $urlFact.attr('data-task-detail').format_url_with_uuid($(this).attr('data-id')),
                'method': 'PUT',
                'data': {'employee_inherit_id': $x.fn.getEmployeeCurrentID()}
            }).then((req)=> {
                let res = $.fn.switcherResp(req);
                if (res && (res['status'] === 201 || res['status'] === 200)) {
                    $.fn.notifyB({'description': $.fn.gettext('Update successfully')}, 'success')
                    _this.addClass('assigned').text($.fn.gettext('Assigned to me'))
                    setTimeout(() => {
                        _this.closest('.tasklist-card').removeClass('has_group')
                    }, 2000)
                }
            },
            (err) => {
                $.fn.notifyB({description: err?.data?.errors || err?.message}, 'failure');
            })

        })
    }

    function callDataTaskList(kanban, list, params = {}, isReturn = false) {
        if (!$empElm[0].closest('#formOpportunityTask') && Object.keys(params).length === 0) {
            $createBtn.off().on('click', () => initCommon.awaitFormSubmit(kanban, list));
            return true;
        }
        let callData = $.fn.callAjax2({
            'url': $urlFact.attr('data-task-list'),
            'method': 'GET',
            'data': params,
        })
        if (isReturn) return callData
        // in this case, we will call all tasks, that belong to employee groups
        let callGAssign = $.fn.callAjax2({
            'url': $urlFact.attr('data-task-has-group'),
            'method': 'GET',
            'data': params,
        })
        $.when(callData, callGAssign).then(
            (reqCall, reqGA) => {
                let data = $.fn.switcherResp(reqCall);
                let dataGA = $.fn.switcherResp(reqGA);
                if (data?.['status'] === 200) {
                    const lstGA = dataGA?.['status'] ? dataGA?.['task_has_group_list'] : [];
                    const taskList = [...data?.['task_list'], ...lstGA]

                    kanban.init(taskList)
                    list.init(list, taskList)
                    // check task extend for other apps
                    if (!$empElm[0].closest('#formOpportunityTask')) {
                        let $tblElm = $('#table_task_list')
                        if ($tblElm.hasClass('dataTable')) {
                            $tblElm.DataTable().clear().draw();
                        }
                    }

                    // Function to wait form create on submit
                    $createBtn.off().on('click', () => initCommon.awaitFormSubmit(kanban, list));
                    let temp = $.extend(true, {}, data)
                    delete temp['task_list']
                    $('.btn-task-bar').data('task_info', temp)
                    $('#btn_load-more').prop('disabled', temp.page_next === 0)

                    // button assign to me of task has group_assignee
                    InitActionClickBtn()
                }
            },
            (err) => {
                $.fn.notifyB({description: err.data.errors}, 'failure');
            }
        );
    }

    jQuery.fn.scroll_to_today = function () {
        $('#scroll_now').click()
    }

    class initCommon {
        static initTableLogWork(dataList) {
            let $table = $('#table_log-work')
            if ($table.hasClass('dataTable')) {
                $table.DataTable().clear().draw();
                $table.DataTable().rows.add(dataList).draw();
            } else $table.DataTable({
                searching: false,
                ordering: false,
                paginate: false,
                info: false,
                data: dataList,
                columns: [
                    {
                        data: 'employee_created',
                        targets: 0,
                        width: "35%",
                        render: (data) => {
                            let avatar
                            const full_name = data.last_name + ' ' + data.first_name
                            if (data?.['avatar'])
                                avatar = `<img src="${data?.['avatar']}" alt="user" class="avatar-img">`
                            else avatar = $.fn.shortName(full_name, '', 5)
                            return `<div class="avatar avatar-rounded avatar-xs avatar-${$x.fn.randomColor()}">
                                        <span class="initial-wrap">${avatar}</span>
                                    </div>
                                    <span class="ml-2">${full_name}</span>`;
                        }
                    },
                    {
                        data: 'start_date',
                        targets: 1,
                        width: "35%",
                        render: (row, type, data) => {
                            let date = moment(row, 'YYYY-MM-DDThh:mm:ss').format('DD/MM/YYYY')
                            date += ' ~ '
                            date += moment(data.end_date, 'YYYY-MM-DDThh:mm:ss').format('DD/MM/YYYY')

                            return date;
                        }
                    },
                    {
                        data: 'time_spent',
                        targets: 2,
                        width: "20%",
                        render: (data) => {
                            return data;
                        }
                    },
                    {
                        data: 'id',
                        targets: 3,
                        width: "10%",
                        render: (data) => {
                            return `<btn type="button" class="btn action act-edit" data-row-id="${data}"><i class="fa-solid fa-pencil"></i></btn>`;
                        }
                    }
                ]
            })
        }

        static renderSubtask(taskID, dataList, dataSub) {
            const $wrap = $('.wrap-subtask')
            let subTaskList = dataSub
            const _this = this
            $wrap.html('')
            if (subTaskList.length) {
                for (let [key, item] of subTaskList.entries()) {
                    const template = $(`<div class="d-flex justify-content-start align-items-center subtask_item" data-index="${key}">
                                    <p class="sub-tit" title="${item.title}">${item.title}</p>
                                    <p class="sub-employee" title="${item.employee_inherit}"><span class="chip chip-primary chip-pill"><span class="chip-text">${item.employee_inherit}</span></span></p>
                                    <button class="btn btn-flush-primary btn-icon btn-rounded ml-auto flush-soft-hover">
                                        <span><i class="fa-regular fa-trash-can fa-sm"></i></span>
                                    </button>
                                 </div>`);
                    $wrap.append(template);
                    const subTaskID = item.id
                    template.find('button').off().on('click', function () {
                        const _isDelete = _this.deleteTask(subTaskID)
                        _isDelete.then((req) => {
                            let res = $.fn.switcherResp(req);
                            if (res?.['status'] === 200) {
                                //remove html in form
                                template.remove()
                                $(`[data-task-id="${subTaskID}"]`).parents('.tasklist-card').remove()
                                // get current task list and remove
                                let isIdx, parentIdx, parentID;
                                for (let [key, value] of dataList.entries()) {
                                    if (value.id === taskID) {
                                        parentIdx = key
                                        parentID = value.id
                                    }
                                    if (value.id === subTaskID) {
                                        isIdx = key
                                        break
                                    }
                                }
                                if (isIdx && parentIdx && parentID) {
                                    dataList.splice(isIdx, 1)
                                    if (parentIdx) {
                                        dataList[parentIdx]['child_task_count'] -= 1
                                        if (dataList[parentIdx]['child_task_count'] < 0)
                                            dataList[parentIdx]['child_task_count'] = 0
                                    }
                                    // reload count sub task in screen kanban view
                                    $(`[data-task-id="${taskID}"]`).parents('.tasklist-card').find('.sub_task_count small').text(
                                        dataList[parentIdx]['child_task_count'])
                                    // count number task in task status
                                    countSTT()
                                }

                                // change view gantt
                                let bk_list = GanttViewTask.bk_taskList;
                                if (subTaskID in bk_list[taskID].values[0].dataObj['parent_n']) {
                                    delete bk_list[taskID].values[0].dataObj['parent_n'][subTaskID]
                                }
                                bk_list[taskID].values[0].dataObj['child_task_count'] -= 1
                                const afterCvt = GanttViewTask.convertFromDictToArray(bk_list, true)
                                $('#gantt_reload').data('data', afterCvt).trigger('click')
                            }
                        })
                    })
                }
            }
        }

        static awaitFormSubmit(kanban, list) {
            $(document).on('From-Task.Submitted', function () {
                const elmData = $('#addNewTaskData')
                const elmUpdate = $('#updateTaskData')
                if (elmData.length) {
                    // parse data
                    const strData = JSON.parse(elmData.attr('data-task'))
                    elmData.remove();
                    // kanban handle new task created
                    kanban.waitDataCreated(strData)

                    if ($empElm[0].closest('#formOpportunityTask')) {
                    // list view handle new task create
                    listViewTask.addNewData(list, strData)

                    // update gantt
                    GanttViewTask.afterUpdate(strData, true)
                    }

                } else if (elmUpdate.length) {
                    // parse data
                    const strData = JSON.parse(elmUpdate.attr('data-task'))
                    elmUpdate.remove()
                    // lấy data vừa update cập nhật vào danh sách task trước đó
                    let taskData = kanban.getTaskList
                    let sameSTT = true
                    let old_stt
                    let idxTaskUpdate
                    for (let [idx, item] of taskData.entries()) {
                        if (item.id === strData.id) {
                            const itemTStt = item.task_status?.id ? item.task_status.id : item.task_status
                            const strTStt = strData.task_status?.id ? strData.task_status.id : strData.task_status
                            if (itemTStt !== strTStt) sameSTT = false
                            strData.parent_n = item.parent_n

                            old_stt = itemTStt
                            taskData[idx] = strData
                            idxTaskUpdate = idx
                            break
                        }
                    }
                    kanban.setTaskList = taskData
                    // update data to task kanban after
                    if (sameSTT) kanban.afterUpdate(strData)
                    else {
                        $(`[data-id="${old_stt}"]`).parents('.tasklist').each(function () {
                            $(this).find($(`[data-task-id="${strData.id}"]`)).parents('.tasklist-card').remove()
                        })
                        kanban.addNewTask(strData)
                    }
                    listViewTask.updateTask(list, strData, idxTaskUpdate)

                    // update gantt
                    GanttViewTask.afterUpdate(strData)
                }
            })
        }

        static deleteTask(taskID) {
            return $.fn.callAjax2({
                'url': $urlFact.attr('data-task-detail').format_url_with_uuid(taskID),
                'method': 'DELETE'
            })
        }

        static reloadCountParent(taskList) {
            let countTemp = {}
            for (let item of Object.values(taskList)) {
                if (item?.parent_n?.id)
                    countTemp[item.parent_n.id] = (countTemp[item.parent_n.id] || 0) + 1;
                else countTemp[item.id] = 0
            }
            for (let key in countTemp) {
                $(`[data-task-id="${key}"]`).parents('.tasklist-card').find('.sub_task_count small').text(countTemp[key])
            }
        }
    }

    // kanban view handle
    class kanbanHandle {
        taskList = []

        set setTaskList(data) {
            this.taskList = data
        }

        get getTaskList() {
            return this.taskList
        }

        showHideSubtask(newHTML = null) {
            let elm = $('.task-discuss')
            const _this = this
            if (newHTML) elm = newHTML.find('.task-discuss')
            elm.off().on('click', function () {
                // toggle Sub task layout
                if ($(this).hasClass('opened')) {
                    $(this).removeClass('opened')
                    $('#tab_kanban').removeClass('isOpened').css('min-height', 'auto')
                    // restore default
                    $('.tasklist-wrap .tasklist-card').removeClass('hidden')
                } else {
                    const $tab1 = $('#tab_kanban'), $subTaskWrap = $('.sub-tasklist-wrap')
                    $(this).addClass('opened')
                    $tab1.addClass('isOpened')
                    let distanceBt = $(document).height() - $tab1.offset().top
                    $tab1.css('min-height', `${distanceBt}px`)
                    $subTaskWrap.css('min-height',
                        `${distanceBt - $('.tasklist-wrap').outerHeight()}px`
                    )
                    const taskID = $(this).parents('.tasklist-card').find('.card-title').attr('data-task-id')
                    // show/hide parent-task and child-task
                    $('.tasklist-card').addClass('hidden')
                    $(this).parents('.tasklist-card').removeClass('hidden')

                    for (let item of Object.values(_this.getTaskList)) {
                        if (item?.parent_n?.id === taskID)
                            $(`.sub-tasklist-wrap [data-task-id="${item.id}"]`).parents('.tasklist-card').removeClass(
                                'hidden')
                    }
                } // end else
            })
            // destroy element after run click function
            newHTML = null
        }

        // handle when click on title task
        editTask(newTaskElm = null) {
            let elm = $('.card-title')
            const _this = this
            if (newTaskElm) elm = newTaskElm.find('.card-title')
            elm.off().on('click', function (e) {
                e.preventDefault()
                const taskID = $(this).attr('data-task-id')
                $.fn.callAjax2({
                    'url': $urlFact.attr('data-task-detail').format_url_with_uuid(taskID),
                    'method': 'GET',
                    'sweetAlertOpts': {'allowOutsideClick': true},
                })
                    .then((req) => {
                        let data = $.fn.switcherResp(req);
                        if (data?.['status'] === 200) {
                            typeof loadDetailTask !== 'function' || loadDetailTask(data, initCommon, _this)
                        }
                    })
            })
            // destroy element after run click function
            newTaskElm = null
        }

        // delete a task
        deleteTask(newTaskElm = null) {
            let elm = $('.del-task-act')
            const _this = this
            if (newTaskElm) elm = newTaskElm.find('.del-task-act')
            elm.off().on('click', function () {
                let taskID = $(this).closest('.tasklist-card').find('.card-title').attr('data-task-id')
                const callDelete = initCommon.deleteTask(taskID)
                callDelete.then((req) => {
                    let res = $.fn.switcherResp(req);
                    if (res?.['status'] === 200) {
                        $(this).closest('.tasklist-card').remove();
                        let currentTaskList = _this.getTaskList
                        let isIdx
                        for (let [key, item] of currentTaskList.entries()) {
                            if (item.id === taskID) {
                                isIdx = key
                                break
                            }
                        }
                        currentTaskList.splice(isIdx, 1)
                        _this.setTaskList = currentTaskList
                        initCommon.reloadCountParent(currentTaskList)
                        // count task in task status
                        countSTT()
                        $.fn.notifyB({description: res.message}, 'success')
                    }
                })
            })
            // reset new task elm
            newTaskElm = null
        }

        // prepare HTML a a task render or return string
        addNewTask(newData, isReturn = false) {
            if (Object.keys(newData).length > 0) {
                let childHTML = $($('.card-child_template').html());
                // loop in newTask object
                let taskStatus = newData.task_status;
                childHTML.find('.card-code').text(newData.code)
                childHTML.find('.card-ticket span').text(newData['percent_completed'])
                childHTML.find('.card-title').text(newData.title).attr('data-task-id', newData.id).attr('title',
                    newData.title)
                let priorityHTML = $($('.priority-badges').html())
                priorityHTML.find('.badge-icon-wrap').text(newData.priority === 0 ? '!' : newData.priority === 1 ?
                    '!!' : '!!!')
                priorityHTML.addClass(`text-${priority_list[newData.priority]}`)
                childHTML.find('.card-priority').html(priorityHTML)
                let date = moment(newData.end_date, 'YYYY-MM-DD hh:mm:ss').format('YYYY/MM/DD')
                childHTML.find('.task-deadline').text(date)
                const assign_to = newData.employee_inherit || newData?.['assign_to']
                if (assign_to && Object.keys(assign_to).length > 0) {
                    if (assign_to?.['avatar']) childHTML.find('img').attr('src', assign_to?.['avatar'])
                    else {
                        // let avClass = 'avatar-xs avatar-' + $x.fn.randomColor() 'light'
                        let avClass = 'avatar-xs avatar-' + 'light'
                        const nameHTML = $x.fn.renderAvatar(assign_to, avClass, "", "full_name")
                        childHTML.find('.avatar').replaceWith(nameHTML)
                    }
                }
                if (newData.checklist) {
                    let done = newData.checklist.reduce((acc, obj) => acc + (obj.done ? 1 : 0), 0);
                    const total = newData.checklist.length
                    childHTML.find('.checklist_progress').text(`${done}/${total}`)
                }
                if (newData.attach) {
                    const fileDetail = newData.attach[0]?.['files']
                    FileUtils.init($(`[name="attach"]`, childHTML).siblings('button'), fileDetail);
                    new $x.cls.file(
                        $('#attachment')
                    ).init({
                        enable_edit: false,
                        data: newData.attach,
                    })
                }

                // if (newData.parent_n && Object.keys(newData?.parent_n).length)
                //     childHTML.find('.task-discuss').remove()
                if (newData?.['child_task_count'] > 0)
                    childHTML.find('.sub_task_count small').text(newData['child_task_count'])
                else childHTML.find('.task-discuss').remove()

                if (newData?.['group_assignee'] && Object.keys(newData?.['group_assignee']).length
                    && Object.keys(newData.employee_inherit).length === 0) {
                    childHTML.addClass('has_group')
                    const $HTMLGroup = $(`<div class="card-noti"><span>${
                            $.fn.gettext('Need assignee!')}</span></div>`
                        + `<div class="received-task"><a href="#" class="w-100" data-id="${newData.id}">${$.fn.gettext('Assign to me')}</a></div>`
                    );
                    childHTML.append($HTMLGroup)
                }
                if (newData?.opportunity && Object.keys(newData?.opportunity).length > 0)
                    childHTML.find('.card-body').append('<span class="float-right active-sales" data-bs-toggle="tooltip"'
                        + 'title="'+newData.opportunity.code +' - '+ newData.opportunity.title+'"><i class="fas far fa-lightbulb"></i></span>')

                if (newData?.['service_order'] && Object.keys(newData?.['service_order']).length > 0){
                    const serviceOrder = newData.service_order
                    childHTML.find('.card-body').append('<span class="float-right is-so" data-bs-toggle="tooltip" '
                        +'title="'+serviceOrder.code+' - '+serviceOrder.title+'"><i class="fas fa-concierge-bell"></i></span>')
                    if (Object.keys(serviceOrder?.opportunity).length > 0) {
                        childHTML.find('.card-body').append('<span class="float-right active-sales" data-bs-toggle="tooltip"'
                            +'title="'+serviceOrder.opportunity.code+' - '+serviceOrder.opportunity.title+'"><i class="fas far fa-lightbulb"></i></span>')
                    }
                }

                if (isReturn) return childHTML
                else {
                    const taskStatusID = taskStatus.id
                    const $thisCrt = this
                    $(`[data-id="${taskStatusID}"]`).closest('.tasklist').find('.wrap-child').each(function () {
                        let temp = childHTML.clone()
                        $(this).append(temp)
                        if ($(this).closest('#kb_scroll').length > 0 && Object.keys(newData?.parent_n).length === -1
                        ) temp.removeClass('hidden')
                        else if ($(this).closest('#kb_sub_scroll').length > 0 && Object.keys(newData?.parent_n).length > 0)
                            temp.removeClass('hidden')
                        temp.find('[data-bs-toggle="tooltip"]').tooltip({placement: 'right'});
                        $thisCrt.editTask(temp)
                        $thisCrt.deleteTask(temp)
                        $thisCrt.logTimeAct(temp)
                        $thisCrt.showHideSubtask(temp)
                    })
                    $('.cancel-task').trigger('click')
                    // reload lại các sub
                    initCommon.reloadCountParent(this.getTaskList)
                    // đếm lại số task trong task status
                    countSTT()

                }
            }
        }

        // on page loaded render task list for task status
        getAndRenderTask(data) {
            let taskByID = {};
            this.setTaskList = data
            let count_parent = {}
            // loop trong ds, lấy data parse ra HTML và cộng vào dict theo task status tương ứng
            for (const item of data) {
                if (item.parent_n && Object.keys(item.parent_n).length){
                    if (count_parent?.[item.parent_n.id]) count_parent[item.parent_n.id] += 1
                    else count_parent[item.parent_n.id] = 1
                }
                const stt = item.task_status.id
                const getStrID = taskByID?.[stt]
                const newTask = this.addNewTask(item, true)

                if (getStrID === undefined) {
                    // chưa có task status trong string html
                    taskByID[stt] = newTask.prop('outerHTML');
                } else {
                    // đã có str stt trong string html
                    taskByID[stt] += newTask.prop('outerHTML');
                }
            }

            // loop trong danh sách status ID append HTMl cho task
            $.each(taskByID, (key, value) => {
                let stsElm = $(`[data-id="${key}"]`).closest('.tasklist')
                $('.wrap-child', stsElm).append(value)
                this.editTask()
                this.deleteTask()
                this.logTimeAct()
                this.showHideSubtask()
            })
            // run tooltip cho avatar
            $('[data-bs-toggle="tooltip"]').tooltip({placement: 'right'});
        }

        // re-render new data for old task
        afterUpdate(data) {
            const $elm = $(`[data-task-id="${data.id}"]`).parents('.tasklist-card')
            $elm.find('.badge-icon-wrap').text(data.priority === 0 ? '!' : data.priority === 1 ?
                '!!' : '!!!')
            $elm.find('.badge-icon').removeClass('text-success text-warning text-danger')
            $elm.find('.badge-icon').addClass(`text-${priority_list[data.priority]}`)
            $elm.find('.card-title').text(data.title).attr('title', data.title)
            $elm.find('.card-title').text(data.title).attr('title', data.title)
            $elm.find('.card-ticket span').text(data.percent_completed)
            if (data?.['assign_to']) {
                const assign_to = data['assign_to']
                if (assign_to?.['avatar']) $elm.find('img').attr('src', assign_to?.['avatar'])
                else {
                    $elm.find('img').remove()
                    let full_name = assign_to.full_name || assign_to.last_name + ' ' + assign_to.first_name
                    const name = $.fn.shortName(full_name)
                    $elm.find('.avatar .initial-wrap').text(name)
                    $elm.find('.avatar').attr('data-bs-original-title', full_name)
                }
            }
            if (data.checklist) {
                let done = data.checklist.reduce((acc, obj) => acc + (obj.done ? 1 : 0), 0);
                const total = data.checklist.length
                $elm.find('.checklist_progress').text(`${done}/${total}`)
            }
            const date = moment(data.end_date, 'YYYY-MM-DD hh:mm:ss').format('YYYY/MM/DD')
            $elm.find('.task-deadline').text(date)
            $('.cancel-task').trigger('click')
            // reload sub count
            initCommon.reloadCountParent(this.getTaskList)
            // đếm lại số task trong task status
            countSTT()
        }

        // async form create is done listening event then of ajax create/update
        waitDataCreated(newData) {
            // get before data parse and push new task has added by user
            let taskData = this.getTaskList
            taskData.push(newData)
            this.setTaskList = taskData

            // call func to render new task added before
            this.addNewTask(newData)
        }

        // create sub task
        createSubTask() {
            const $btnCreateSub = $('.create-subtask')
            $btnCreateSub.off().on('click', function () {
                // call form create-task.js
                const taskID = $(this).closest('form').find('[name="id"]').val()
                const taskTxt = $(this).closest('form').find('[name="title"]').val()
                $('#drawer_task_create .simplebar-content-wrapper').animate({scrollTop: 0}, "fast");
                let oppData = {}
                if ($oppElm.val())
                    oppData = {
                        "id": $oppElm.select2('data')[0].id,
                        "title": $oppElm.select2('data')[0].text,
                    }
                if (taskID) {
                    resetFormTask()
                    $('.title-create').removeClass("hidden")
                    $('.title-detail').addClass("hidden")
                    $('.btn-assign').removeClass('disabled')
                    $('.parents-block').removeClass('hidden')
                    // after reset
                    $('[name="parent"]', $formElm).val(taskTxt)
                    $formElm.append(`<input type="hidden" name="parent_n" value="${taskID}"/>`)
                    if (Object.keys(oppData).length) {
                        $oppElm.append(`<option value="${oppData.id}" selected>${oppData.title}</option>`)
                            .prop('disabled', true)
                    } else $oppElm.removeAttr('data-onload')
                    $oppElm.initSelect2()

                    const employee = JSON.parse($('#employee_info').text())
                    $('#inputAssigner').val(employee.full_name).attr({
                        "value": employee.id,
                        "data-name": employee.full_name,
                        "data-value-id": employee.id,
                    })
                }
            })
        }

        logTimeAct(htmlElm = null) {
            let btnLogTime = $('.log-task-act')
            if (htmlElm !== null) btnLogTime.find('.log-task-act')
            const elmTaskID = $('#logtime_task_id')
            // handle on click toggle btn
            btnLogTime.off().on('click', function () {
                $('#startDateLogTime, #endDateLogTime, #EstLogtime').val(null)
                $($(this).attr('href')).modal('show')
                const IDTask = $(this).parents('.tasklist-card').find('.card-title').attr('data-task-id')
                elmTaskID.val(IDTask)
            })
        }

        init(data) {
            // clean when create new init
            $('.wrap-child').html('')
            this.getAndRenderTask(data);
            this.createSubTask();
            countSTT()
            const $this = this
            $('[href="#tab_kanban"]').on('show.bs.tab', function () {
                $('.wrap-child').html('')
                $this.getAndRenderTask($this.getTaskList)
            })

            $contentElm.on('scroll', function () {
                let $kanbanEle = $('#tab_kanban');
                let kanbanTop = $kanbanEle.offset().top;
                if (kanbanTop > 0) {
                    let distanceToHeader = $kanbanEle.offset().top - 115;
                    if ($kanbanEle.hasClass('active')) {
                        if (distanceToHeader <= 0) $('#tasklist_wrap').addClass('scroll_active')
                        else $('#tasklist_wrap').removeClass('scroll_active')
                    }
                }
            })
        }
    }

    // drag handle
    class dragHandle {
        onDrop(el, target, source, isSub = false) {
            const dataSttUpdate = {
                "id": $(el).find('.card-title').attr('data-task-id'),
                "task_status": $(target).attr('id').split('taskID-')[1],
            }
            const config = JSON.parse($('#task_config').text());
            let isCompleted = config.list_status.filter((item) => {
                if (item.id === dataSttUpdate.task_status)
                    return item.is_finish
            })
            $.fn.callAjax2({
                'url': $urlFact.attr('data-change-stt'),
                'method': 'PUT',
                'data': dataSttUpdate
            })
                .then(
                    (req) => {
                        const res = $.fn.switcherResp(req)
                        if (res.status === 200) {
                            const taskID = $('.card-title', el).attr('data-task-id')
                            if (isSub) {
                                const taskTargetID = $(target).attr('id').split('sub-')[1]
                                const taskEl = $(`[data-task-id="${taskID}"]`, '#tasklist_wrap').closest('.tasklist-card')
                                // nếu kéo task từ sub -> lấy task ẩn của task chính kéo sang cột tương ứng
                                if (isCompleted && isCompleted?.[0]?.['is_finish'])
                                    taskEl.find('.card-ticket span').text('100')
                                $(taskEl).appendTo($(`#${taskTargetID}`))
                            } else {
                                const taskTargetID = $(target).attr('id')
                                const taskEl = $(`[data-task-id="${taskID}"]`, '#sub-tasklist_wrap').closest('.tasklist-card')
                                if (isCompleted && isCompleted?.[0]?.['is_finish'])
                                    taskEl.find('.card-ticket span').text('100')
                                $(taskEl).appendTo($(`#sub-${taskTargetID}`))
                            }
                            if (isCompleted && isCompleted?.[0]?.['is_finish'])
                                $(el).closest('.tasklist-card').find('.card-ticket span').text('100')
                            const config = JSON.parse($('#task_config').text());
                            let task_changed = {};
                            for (const item of config.list_status) {
                                if (item.id === dataSttUpdate.task_status) {
                                    task_changed = item
                                    break;
                                }
                            }

                            let k_list = kanbanTask.getTaskList;
                            for (let item of k_list) {
                                if (item.id === dataSttUpdate.id) {
                                    if (isCompleted && isCompleted?.[0]?.['is_finish'])
                                        item.percent_completed = 100
                                    item.task_status = {...task_changed, 'title': task_changed.name}
                                    break;
                                }
                            }
                            // update data kanban
                            kanbanTask.setTaskList = k_list
                            listTask.setTaskList = k_list
                            countSTT()
                        } else {
                            drake.cancel(el)
                        }
                    },
                    (errs) => {
                        $.fn.notifyB({'description': errs?.data?.errors}, 'failure')
                        $(el, target).appendTo(source);
                    }
                )
        }

        init() {
            let dragArray = []
            const _this = this
            $('#kb_scroll .wrap-child').each(function () {
                if ($(this).attr('id') !== '') {
                    dragArray.push(this)
                }
            })
            let drake = dragula(dragArray)
            // handle event on drag change task status
            drake.on('drop', function (el, target, source) {
                _this.onDrop(el, target, source)
            });

            // sub task setup
            let dragArraySub = []
            $('#kb_sub_scroll .wrap-child').each(function () {
                if ($(this).attr('id') !== '') {
                    dragArraySub.push(this)
                }
            })
            let drakeSub = dragula(dragArraySub)
            drakeSub.on('drop', function (el, target, source) {
                _this.onDrop(el, target, source, true)
            });
        }
    }

    // list view handle
    class listViewTask {

        constructor() {
            this.taskConfig = '';
            this.taskList = [];
        }

        set setConfig(data) {
            this.taskConfig = data
        }

        set setTaskList(data) {
            this.taskList = data
        }

        get getTaskList() {
            return this.taskList
        }

        get getConfig() {
            return this.taskConfig
        }

        init(cls, data) {
            this.setTaskList = data
            this.setConfig = JSON.parse($('#task_config').text());
            listViewTask.renderTable(cls)

            $('[href="#tab_list"]').on('show.bs.tab', function () {
                listViewTask.renderTable(cls)
            })
        }

        static selfInitSelect2(elm, data, key = 'title') {
            data = {...data, selected: true}
            elm.attr('data-onload', JSON.stringify(data)).removeClass('is-valid')
            elm.parents('.form-group').removeClass('has-error').find('small.is-invalid').remove()
            if ($(`option[value="${data.id}"]`, elm).length <= 0)
                elm.html('').append(`<option value="${data.id}">${data[key]}</option>`)
            elm.initSelect2()
        }

        static appendDataToForm(cls, $form, taskID) {
            $.fn.callAjax2({
                "url": $urlFact.attr('data-task-detail').format_url_with_uuid(taskID),
                "method": "get"
            }).then(
                (req) => {
                    const data = $.fn.switcherResp(req)
                    if (data.status === 200) {
                        typeof loadDetailTask !== 'function' || loadDetailTask(data, initCommon, cls)
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure')
                }
            )

        }

        static actionClickBtn(cls, row, data, index) {
            let tbl = $('#table_task_list')
            if (data.edited) {
                $('.cancel-task').trigger('click')
                data.edited = false
                tbl.DataTable().cell(index, 6).data(data.edited).draw(true)
            } else {
                const allData = cls.getTaskList
                let infoOld
                allData.map((item, idx) => {
                        if (item.edited === true) infoOld = idx
                        item.edited = false
                    }
                )
                allData[index].edited = true
                cls.setTaskList = allData
                if (typeof infoOld === 'number') // case click task khác mà chưa đóng task cũ
                    tbl.DataTable().cell(infoOld, 6).data(false).draw(false)
                tbl.DataTable().cell(index, 6).data(true).draw(false)
                listViewTask.appendDataToForm(cls, $formElm, data.id)
            }
        }

        static renderTable(cls) {
            const dataList = cls.getTaskList
            const $tblElm = $('#table_task_list')
            if ($tblElm.hasClass('dataTable'))
                $tblElm.DataTable().clear().rows.add(dataList).draw();
            else
                $tblElm.DataTableDefault({
                    "data": dataList,
                    "columns": [
                        {
                            "data": 'title',
                            "class": "col-3",
                            render: (row, type, data) => {
                                let HTMLGroup = '';
                                if (data?.group_assignee && Object.keys(data?.group_assignee).length > 0 && Object.keys(data?.employee_inherit).length === 0) {
                                    HTMLGroup = `<div class="card-noti"><span>${
                                            $.fn.gettext('Need assignee!')}</span></div>`
                                        + `<div class="received-task"><a class="w-100" data-id="${data.id}"><span><i class="fa-solid fa-circle-plus"></i></span>${$.fn.gettext('Assign to me')}</a></div>`
                                }
                                return `<span class="mr-2">${row ? row : "_"}</span>` +
                                    '<span class="badge badge-primary badge-indicator-processing badge-indicator" style="margin-top: -1px;"></span>'
                                    + `<span class="ml-2 font-weight-bold mr-2">${data.code}</span>`
                                    + `<label class="card-ticket" title="${$.fn.gettext('Percent completed')}" aria-labelledby="percent completed">`
                                    + `<span>${data['percent_completed']}</span>%</label>${HTMLGroup}`
                            }
                        },
                        {
                            "data": 'priority',
                            "class": 'w-5',
                            render: (row) => {
                                let $badge = $($('.priority-badges').html());
                                $badge.find('.badge-icon-wrap').text(
                                    row === 0 ? '!' : row === 1 ? '!!' : '!!!'
                                )
                                $badge.addClass(`text-${priority_list[row]}`)
                                return $badge.prop('outerHTML')
                            }
                        },
                        {
                            "data": "task_status",
                            "class": "w-15",
                            render: (row) => {
                                const config = cls.getConfig
                                let html = $('<span class="badge text-dark font-2">')
                                for (let cf of config.list_status) {
                                    if (cf.id === row.id) {
                                        html.css('background-color', cf.task_color).text(row.title)
                                        break;
                                    }
                                }
                                return html.prop('outerHTML')
                            }
                        },
                        {
                            "data": "employee_inherit",
                            "class": "w-15 text-right",
                            render: (row, type, data) => {
                                let html = ''
                                if (!data.employee_created?.full_name)
                                    data.employee_created.full_name = data.employee_created.last_name +
                                        ' ' + data.employee_created.first_name
                                const assigner = $x.fn.renderAvatar(data.employee_created).replace(
                                    'avatar-primary', 'avatar-blue')
                                let assignee = ''
                                if (row) {
                                    if (!row.full_name && row.last_name && row.first_name)
                                        row.full_name = row.last_name + ' ' + row.first_name
                                    assignee = $x.fn.renderAvatar(row).replace(
                                        'avatar-primary', 'avatar-soft-light')
                                }
                                html += assigner + '<supper>»</supper>' + assignee
                                return html
                            }
                        },
                        {
                            "data": "end_date",
                            "class": "col-1",
                            render: (row) => {
                                if (!row) row = new Date()
                                return `<span>${$x.fn.parseDate(row)}<span>`
                            }
                        },
                        {
                            "data": "opportunity",
                            "class": "col-1",
                            render: (row, type, data) => {
                                let html = '--';
                                if (row?.code) html = `<span>${row.code}</span>`
                                if (data?.service_order && Object.keys(data?.service_order).length){
                                    const ser = data.service_order;
                                    const opp = ser?.opportunity
                                    html = `<span class="font-3">${ser.code ? ser.code : ser.title
                                    }</span><hr class="line-1"><span class="txt-2">${Object.keys(opp).length > 0 ? opp.code : '--'}</span>`
                                }
                                return html
                            }
                        },
                        {
                            "class": "col-1 text-center",
                            render: (row, type, data) => {
                                const isEdit = data?.edited ? data.edited : false;
                                let $btn = $('<div><button class="btn btn_task-list-action btn-icon btn-rounded bg-dark-hover" type="button"></button></div>')
                                $btn.find('button').html(`<span class="icon"><i class="fa-regular ${isEdit ? 'fa-eye' : 'fa-eye-slash'}"></i></span>`)
                                $btn.append(`<div class="list_act-wrap">${
                                    $('.card-child_template .card-action-wrap').html()}</div>`)
                                return $btn.prop('outerHTML')
                            }
                        }
                    ],
                    rowCallback: (row, data, index) => {
                        if (data?.group_assignee
                            && Object.keys(data?.group_assignee).length > 0
                            && Object.keys(data?.employee_inherit).length === 0) {
                            row.classList.add('has_group')
                        }

                        $('.avatar', row).tooltip({placement: 'top'})

                        // click view task list
                        $('.btn_task-list-action', row).off().on('click', function () {
                            listViewTask.actionClickBtn(cls, row, data, index)
                        })
                        // click delete
                        $('.del-task-act', row).off().on('click', function () {
                            listViewTask.deleteTask(cls, data, index)
                        })
                        // click logwork
                        $('.log-task-act', row).off().on('click', function () {
                            const elmTaskID = $('#logtime_task_id')
                            $('#startDateLogTime, #endDateLogTime, #EstLogtime').val(null)
                            $($(this).attr('href')).modal('show')
                            elmTaskID.val(data.id)
                        })
                        $('[data-bs-toggle="tooltip"]', row).tooltip({placement: 'top'})
                    }
                }).on('draw.dt', function () {
                    $tblElm.find('tbody').find('tr').each(function () {
                        $(this).after('<tr class="table-row-gap"><td></td></tr>');
                    });
                });
        }

        static addNewData(cls, newData) {
            let currentList = cls.getTaskList
            const hasData = false;
            if (Object.keys(currentList).length > 0)
                for (let item of currentList) {
                    if (item.id === newData.id) return true
                }
            if (!hasData) currentList.push(newData)
            const $tblElm = $('#table_task_list')
            $tblElm.DataTable().row.add(newData).draw()
        }

        static deleteTask(cls, row, data, index) {
            let req = initCommon.deleteTask(data.id)
            req.then((resp) => {
                let res = $.fn.switcherResp(resp);
                if (res?.['status'] === 200) {
                    const tbl = $('#table_task_list')
                    let currentTaskList = cls.getTaskList
                    currentTaskList.splice(index, 1)
                    cls.setTaskList = currentTaskList
                    tbl.DataTable().row(row).remove().draw();
                    $.fn.notifyB({description: res.message}, 'success')
                }
            })
        }

        static updateTask(cls, data, index) {
            const tbl = $('#table_task_list')
            let dataCurrent = cls.getTaskList
            dataCurrent[index] = data
            cls.setTaskList = dataCurrent
            tbl.DataTable().row(index).data(data).draw()
        }
    }

    // gantt view handle
    class GanttViewTask {
        static taskList = []
        static bk_taskList = {}

        static convertFromDictToArray(dataList, isReturn = false) {
            let reNewList = []
            // loop trong danh sách dictionary và duyệt lại thành danh sách array task con sau task cha
            for (let key in dataList) {
                const item = dataList[key]
                if (!item.values?.[0]?.dataObj) continue;
                item.show_expand = item.values?.[0].dataObj.child_task_count > 0 || false
                reNewList.push(item)
                const parent_n = item.values[0].dataObj['parent_n']
                if (parent_n && Object.keys(parent_n).length) {
                    // có task con
                    item.is_expand = true // mặc định ẩn task con "false" otherwise "true" show task con
                    for (let value in parent_n) {
                        let child = parent_n[value]
                        reNewList.push(child)
                    }
                }
            }
            GanttViewTask.taskList = reNewList
            if (isReturn) return reNewList
        }

        static saveTaskList(data = []) {
            let settingColors = JSON.parse($('#task_config').text());
            let bk_list = $.extend(true, {}, GanttViewTask.bk_taskList)
            let taskClr = {}
            for (let item of settingColors.list_status) {
                taskClr[item.id] = item.task_color
            }
            if (data && data.length) {
                // convert data thành dictionary với parent_n là danh sách task con
                for (let item of data) {
                    let from = new Date(item.start_date)
                    from.setHours(0, 0, 0, 0);
                    from.setDate(from.getDate() + 1)
                    let to = new Date(item.end_date)
                    to.setHours(0, 0, 0, 0);
                    to.setDate(to.getDate() + 1);
                    // kt có cấp cha và danh sách cấp con không rỗng
                    if ('parent_n' in item && Object.keys(item['parent_n']).length) {
                        if (item.parent_n.id in bk_list) {
                            if (!('parent_n' in bk_list[item.parent_n.id])) bk_list[item.parent_n.id]['parent_n'] = []
                            bk_list[item.parent_n.id]['parent_n'][item.id] = {
                                desc: item.title,
                                show_expand: item?.['show_expand'] ? item.show_expand : false,
                                values: [{
                                    from: isNaN(from.getTime()) ? null : "/Date(" + from.getTime() + ")/",
                                    to: isNaN(to.getTime()) ? null : "/Date(" + to.getTime() + ")/",
                                    customClass: "ganttGreen",
                                    dataObj: {...item, customBg: taskClr[item.task_status.id]}
                                }]
                            }
                            if (item?.['is_visible'] === false)
                                bk_list[item.parent_n.id]['parent_n'][item.id]['is_visible'] = false
                            if (item?.['is_expand'])
                                bk_list[item.parent_n.id]['parent_n'][item.id]['is_expand'] = item['is_expand']

                        }
                    } else {
                        // ko có cấp cha
                        bk_list[item.id] = {
                            name: item.title,
                            show_expand: item?.['show_expand'] ? item.show_expand : false,
                            values: [{
                                from: isNaN(from.getTime()) ? null : "/Date(" + from.getTime() + ")/",
                                to: isNaN(to.getTime()) ? null : "/Date(" + to.getTime() + ")/",
                                customClass: "ganttGreen",
                                dataObj: {...item, customBg: taskClr[item.task_status.id]}
                            }]
                        }
                        if (item?.['is_visible'] === false)
                            bk_list[item.id]['is_visible'] = false
                        if (item?.['is_expand'])
                            bk_list[item.id]['is_expand'] = item['is_expand']
                    }
                }
            }
            GanttViewTask.bk_taskList = bk_list
            return Object.values(bk_list).sort((a, b) => {
                const cA = a.values[0].dataObj.end_date.split(' ')[0];
                const cB = b.values[0].dataObj.end_date.split(' ')[0];
                return cA.localeCompare(cB);
            })
        }

        static loadTaskInfo(dataID) {
            $('#offCanvasRightTask').offcanvas('show')
            $.fn.callAjax2({
                url: $urlFact.attr('data-task-detail').format_url_with_uuid(dataID),
                method: "get"
            })
                .then((resp) => {
                    let data = resp.data
                    $('.title-create').addClass("hidden")
                    $('.title-detail').removeClass("hidden")
                    $('#inputTextTitle', $formElm).val(data.title)
                    $('#inputTextCode', $formElm).val(data.code)
                    listViewTask.selfInitSelect2($('#selectStatus', $formElm), data.task_status)
                    $formElm.find('input[name="id"]').remove()
                    const taskIDElm = $(`<input type="hidden" name="id" value="${data.id}"/>`)
                    $formElm.append(taskIDElm).addClass('task_edit')
                    $('#inputTextStartDate', $formElm)[0]._flatpickr.setDate(data.start_date)
                    $('#inputTextEndDate', $formElm)[0]._flatpickr.setDate(data.end_date)
                    $('#inputTextEstimate', $formElm).val(data.estimate)

                    $('#selectPriority', $formElm).val(data.priority).trigger('change')
                    $('#rangeValue').text(data['percent_completed'])
                    $('#percent_completed').val(data['percent_completed'])
                    $('#inputAssigner', $formElm).val(data.employee_created.full_name)
                        .attr('data-value-id', data.employee_created.id)
                        .attr('value', data.employee_created.id)
                    if (data?.['opportunity'])
                        listViewTask.selfInitSelect2($($oppElm, $formElm), data['opportunity'])
                    listViewTask.selfInitSelect2($('#employee_inherit_id', $formElm), data.employee_inherit, 'full_name')
                    if (data.label) window.formLabel.renderLabel(data.label)
                    if (data.remark) window.editor.setData(data.remark)
                    if (data.checklist) {
                        window.checklist.setDataList = data.checklist
                        window.checklist.render()
                    }

                    if (data.attach) {
                        const fileDetail = data.attach[0]?.['files']
                        FileUtils.init($(`[name="attach"]`).siblings('button'), fileDetail);
                    }
                    initCommon.initTableLogWork(data?.['task_log_work'])
                    initCommon.renderSubtask(data.id, GanttViewTask.taskList, data?.['sub_task_list'])

                    if (Object.keys(data.parent_n).length <= 0) $('.create-subtask').removeClass('hidden')
                    else $('.create-subtask').addClass('hidden')
                });
        }

        static onClickParent(ID) {
            let bk_list = GanttViewTask.bk_taskList
            let obj_parent = bk_list[ID]
            let settingColors = JSON.parse($('#task_config').text());
            let taskClr = {}
            for (let item of settingColors.list_status) {
                taskClr[item.id] = item.task_color
            }
            // nếu task cha đang hide (expand = false)
            if (!obj_parent.is_expand) {
                let callChill = GanttViewTask.CallData({parent_n: ID})
                callChill.then((rep) => {
                    let data = $.fn.switcherResp(rep);
                    let newData = {}
                    if (data?.['status'] === 200 && data?.['task_list'].length) {
                        for (let item of data['task_list']) {
                            let from = new Date(item.start_date)
                            from.setHours(0);
                            from.setMinutes(0);
                            from.setDate(from.getDate() + 1)
                            let to = new Date(item.end_date)
                            to.setHours(0);
                            to.setMinutes(0);
                            to.setDate(to.getDate() + 1);
                            newData[item.id] = {
                                is_visible: true,
                                desc: item.title,
                                values: [{
                                    from: isNaN(from.getTime()) ? null : "/Date(" + from.getTime() + ")/",
                                    to: isNaN(to.getTime()) ? null : "/Date(" + to.getTime() + ")/",
                                    dataObj: {...item, customBg: taskClr[item.task_status.id]}
                                }]
                            }
                        }
                        obj_parent.is_expand = true
                        obj_parent.values[0].dataObj.parent_n = newData
                        bk_list[ID] = obj_parent
                        GanttViewTask.bk_taskList = bk_list
                        const afterCvt = GanttViewTask.convertFromDictToArray(bk_list, true)
                        $('#gantt_reload').data('data', afterCvt).trigger('click')
                    }
                })
            } else { // task cha đang show (expand = true)
                obj_parent.is_expand = false
                obj_parent.values[0].dataObj.parent_n = {}
                bk_list[ID] = obj_parent
                GanttViewTask.bk_taskList = bk_list
                const afterCvt = GanttViewTask.convertFromDictToArray(bk_list, true)
                $('#gantt_reload').data('data', afterCvt).trigger('click')
            }
        }

        static clickLoadMore(e) {
            let loadMoreIf = $('.gantt_table').data('api_info')
            if (loadMoreIf.page_next > 0) {
                const params = {
                    "parent_n__isnull": true,
                    "page": loadMoreIf.page_next,
                    "pageSize": loadMoreIf.page_size
                }
                let loadMoreData = GanttViewTask.CallData(params)
                loadMoreData.then(
                    (req) => {
                        let data = $.fn.switcherResp(req);
                        if (data?.['status'] === 200) {
                            const temp = Object.assign({}, req.data);
                            delete temp['task_list'];
                            $('.gantt_table').data('api_info', temp)
                            $(e).prop("disabled", temp.page_next > 0)
                            const newObjData = GanttViewTask.saveTaskList(data['task_list'])
                            $('#gantt_reload').data('data', newObjData).trigger('click')
                        }
                    })
            }
        }

        static onCallback() {
            const $ganttElm = $('.gantt_table'), $fltBar = $('.filter_bar'), $leftC = $('.left-container'),
                $panelElm = $('.rightPanel .dataPanel');
            const currentHeight = $panelElm.css("height");
            const callDataInfo = $ganttElm.data('api_info')
            const rightPanelHeight = $('.leftPanel .row.spacer').outerHeight()
            $('#gantt_load-more_btn').prop("disabled", callDataInfo.page_next === 0)
            // calc window screen và limit height cho khung gantt
            let _gantt_distance = $(document).height() - $ganttElm.offset().top
            const afterCalc = Math.round(_gantt_distance - $fltBar.outerHeight() - rightPanelHeight - 54)
            // 54 là tổng padding và margin của các div bao ngoài
            $leftC.css({"height": afterCalc})

            const rightHeight = Math.round(_gantt_distance - $fltBar.outerHeight() - 54)
            $panelElm.css({"height": rightHeight})
            $('.panel-content-bar').css({
                "height": currentHeight.replace("px", ''),
                "top": parseInt(`-${rightPanelHeight}`)
            })

            // handle scroll down
            $leftC.scroll(function () {
                $('.panel-content-bar').css({
                    "top": parseInt(`-${rightPanelHeight + $(this).scrollTop()}`)
                })
            });
        }

        static renderGantt() {
            const $transElm = $('#trans-factory')
            let columns_gantt = [
                {value: 'title', label: $transElm.attr('data-name'), show: true, width: '300'},
                {value: 'priority', label: $transElm.attr('data-priority'), show: true, width: '100'},
                {value: 'employee_created', label: $transElm.attr('data-assigner'), show: true, width: '50'},
                {value: 'employee_inherit', label: $transElm.attr('data-assignee'), show: true, width: '50'},
                {value: 'start_date', label: $transElm.attr('data-st-date'), show: true, width: '150'},
                {value: 'end_date', label: $transElm.attr('data-ed-date'), show: true, width: '150'},
            ]
            const sourceDT = GanttViewTask.taskList
            $(".gantt").gantt({
                source: sourceDT,
                navigate: 'scroll',
                columns: columns_gantt,
                itemsPerPage: 100,
                // resizeable: true,
                onClickParent: GanttViewTask.onClickParent,
                loadTaskInfo: GanttViewTask.loadTaskInfo,
                isShowSetting: true,
                clickLoadMore: GanttViewTask.clickLoadMore,
                onRender: GanttViewTask.onCallback
                // resizeStartDate,
                // resizeEndDate

            });
        }

        static CallData(data = null) {
            let params = {"parent_n__isnull": true, task_status__is_finish: false}
            if (data) params = data
            return $.fn.callAjax2({
                    'url': $urlFact.attr('data-task-list'),
                    'method': 'GET',
                    'data': params
                }
            )
        }

        static CallFilter(data) {
            let params = {"parent_n__isnull": true, ...data}
            let loadFilterData = GanttViewTask.CallData(params)
            loadFilterData.then((req) => {
                let data = $.fn.switcherResp(req);
                if (data?.['status'] === 200) {
                    const temp = Object.assign({}, req.data)
                    delete temp['task_list'];
                    $('.gantt_table').data('api_info', temp)
                    GanttViewTask.bk_taskList = []
                    const dictList = GanttViewTask.saveTaskList(data['task_list'])
                    const arrayList = GanttViewTask.convertFromDictToArray(dictList, true)
                    $('#gantt_reload').data('data', arrayList).trigger('click')
                }
            })
        }

        static afterUpdate(data, is_new = false) {
            let dictList;
            if (is_new) {
                let temp = []
                temp.push(data)
                dictList = GanttViewTask.saveTaskList(temp)
            } else {
                let oldData = GanttViewTask.bk_taskList[data.id]
                if (oldData) {
                    if (oldData.desc === undefined) oldData.name = data.title
                    else oldData.desc = data.title
                    let from = new Date(data.start_date)
                    from.setHours(0, 0, 0, 0);
                    from.setDate(from.getDate() + 1)
                    let to = new Date(data.end_date)
                    to.setHours(0, 0, 0, 0);
                    to.setDate(to.getDate() + 1);
                    let new_value = {}
                    for (let item in oldData.values[0].dataObj) {
                        if (data.hasOwnProperty(item))
                            new_value[item] = data[item]
                        if (item === 'opportunity')
                            new_value['opportunity'] = data['opportunity_data']
                        if (item === 'child_task_count')
                            new_value['child_task_count'] = oldData.values[0].dataObj[item]
                    }
                    oldData.values = [{
                        from: isNaN(from.getTime()) ? null : "/Date(" + from.getTime() + ")/",
                        to: isNaN(to.getTime()) ? null : "/Date(" + to.getTime() + ")/",
                        dataObj: new_value
                    }]
                    dictList = GanttViewTask.saveTaskList(oldData)
                }
            }
            const arrayList = GanttViewTask.convertFromDictToArray(dictList, true)
            $('#gantt_reload').data('data', arrayList).trigger('click')
        }

        static initGantt() {
            let firstCall = GanttViewTask.CallData()
            firstCall.then(
                (req) => {
                    let data = $.fn.switcherResp(req);
                    if (data?.['status'] === 200) {
                        let cloneData = Object.assign({}, req.data)
                        delete cloneData['task_list'];
                        $('.gantt_table').data('api_info', cloneData)
                        const afterDataConvert = GanttViewTask.saveTaskList(data['task_list'])
                        GanttViewTask.convertFromDictToArray(afterDataConvert)
                        GanttViewTask.renderGantt()
                    }
                })
            if (!$('.gantt').length) $('.gantt_table').append('<div class="gantt"></div>');
            $('.tab-gantt[data-bs-toggle="tab"]').on('show.bs.tab', function () {
                $('#gantt_reload').data('data', GanttViewTask.taskList).trigger('click')
            });
        }
    }

    /** ********************************************* **/
    // render column status của task
    getSttAndRender()
    // render task
    const kanbanTask = new kanbanHandle()
    const listTask = new listViewTask()
    callDataTaskList(kanbanTask, listTask, {'task_status__is_finish': false})
    GanttViewTask.initGantt()
    // on click save btn log work
    logworkSubmit()
    // init dragula
    let objDrag = new dragHandle()
    objDrag.init()

    // Horizontal scroll
    new PerfectScrollbar('#kb_scroll, #kb_sub_scroll', {
        suppressScrollY: true,
    });
    const $fOppElm = $('#filter_opportunity_id')
    const $fSttElm = $('#filter_task_status')
    const $fEmpElm = $('#filter_employee_id')
    const $fPriority = $('#filter_priority_id')
    const $fServiceOrder = $('#filter_so_id')
    const $clearElm = $('.clear-all-btn')
    const $sGrpElm = $('#sort_by_group_assignee')
    const $ElmDateRange = $('#iptDateRange')
    const listElm = [$fOppElm, $fSttElm, $fEmpElm, $fServiceOrder, $fPriority];
    function rtParams (){
        let params = {}
        if ($fOppElm.val() !== null) params.opportunity = $fOppElm.val()
        if ($fSttElm.val() !== null){
            if ($fSttElm.val() !== 'is_finish')
                params.task_status = $fSttElm.val()
            else if ($fSttElm.val() === 'is_finish')
                params.task_status__is_finish = false
        }
        if ($fEmpElm.val() !== null) params.employee_inherit = $fEmpElm.val()
        if ($fServiceOrder.val() !== null) params.service_order = $fServiceOrder.val()
        if ($fPriority.val()) params.priority = $fPriority.val()
        const dateLst = $ElmDateRange.val().split(' ')
        if (dateLst && dateLst.length === 3) {
            if (dateLst[0] !== dateLst[2]) {
                params.end_date__range = dateLst[0] + ',' + dateLst[2]
            } else params.end_date = dateLst[0]
        }
        return params
    }
    listElm.forEach(function (elm) {
        if (elm.length > 0) {
        $(elm).initSelect2().on('change.select2', function () {
            const params = rtParams()
            callDataTaskList(kanbanTask, listTask, params)
            GanttViewTask.CallFilter(params)
            $clearElm.addClass('d-inline-block')
            if ($(this).select2('data').length > 0)
                $(elm).addClass('isSelected')
            else $(elm).removeClass('isSelected')
        })
        }
    })

    $clearElm.off().on('click', () => {
        listElm.forEach(function (elm) {
            $(elm).val('').trigger('change').removeClass('isSelected')
        })
        $ElmDateRange.removeClass('isSelected')
        $ElmDateRange[0]._flatpickr.clear()
        callDataTaskList(kanbanTask, listTask)
        GanttViewTask.CallFilter({})
        $clearElm.removeClass('d-inline-block')
        $ElmDateRange.prop('checked', false)
    })
    $sGrpElm.on('change', function (e) {
        e.preventDefault()
        const $taskItemElm = $('.tasklist-card')
        if (this.checked) {
            $taskItemElm.addClass('hidden')
            $taskItemElm.each(function(){
                if($(this).hasClass('has_group'))
                   $(this).removeClass('hidden')
            })

        } else {
            $taskItemElm.removeClass('hidden')
        }
    });

    // load more button
    $('#btn_load-more').on('click', function () {
        let load_info = $('.btn-task-bar').data('task_info')
        let params = {
            "page": load_info.page_next,
            "pageSize": load_info.page_size
        }
        if ($fOppElm.val() !== null) params.opportunity = $fOppElm.val()
        if ($fSttElm.val() !== null){
            if ($fSttElm.val() !== 'is_finish')
                params.task_status = $fSttElm.val()
            else if ($fSttElm.val() === 'is_finish')
                params.task_status__is_finish = false
        }
        if ($fEmpElm.val() !== null) params.employee_inherit = $fEmpElm.val()
        let request = callDataTaskList(null, null, params, true)
        request.then((rep) => {
            let data = $.fn.switcherResp(rep);
            if (data?.['status'] === 200) {
                let temp = $.extend(true, {}, data)
                delete temp['task_list']
                $('.btn-task-bar').data('task_info', temp)
                $('#btn_load-more').prop('disabled', temp.page_next === 0)
                // merge danh sach cu voi danh sach lay duoc xoa danh sach cu va render lai danh sach moi
                const currentData = kanbanTask.getTaskList.concat(data['task_list'])
                $('.tasklist .wrap-child').html('')
                kanbanTask.getAndRenderTask(currentData)
                listTask.init(listTask, currentData)
            }

        })
    });

    const loadMoreBtn = $('.btn-task-bar')
    $contentElm.scroll(function () {
        $(this).scrollTop() > 100 && !$('.tab-gantt').hasClass('active') ? loadMoreBtn.fadeIn() : loadMoreBtn.fadeOut();
    });

    let urlParams = $x.fn.getManyUrlParameters(['task_id', 'comment_id']);
    if (urlParams?.['comment_id'] && urlParams?.['task_id']) {
        const modalEle = $('#CommentModal');
        const taskElm = $(`.card-title[data-task-id="${urlParams?.['task_id']}"]`, modalEle)
        if (taskElm.length) {
            const titleTask = taskElm.attr('title')
            modalEle.find('.modal-title').append(`<span>${$.fn.gettext('of task')} "${titleTask}"</span>`)
        }
        modalEle.modal('show');
        new $x.cls.cmt(modalEle.find('.comment-group')).init(
            urlParams?.['task_id'],
            "e66cfb5a-b3ce-4694-a4da-47618f53de4c",
            {"comment_id": urlParams?.['comment_id']}
        )
        modalEle.on('hidden.bs.modal', function () {
            delete modalEle.find('.modal-title span')
        })
    }
    if (urlParams?.['task_id'] && !urlParams?.['comment_id']) {
        let tempHTML = document.createElement("p");
        tempHTML['style'] = 'display:none';
        tempHTML.innerHTML = `<span class="card-title" data-task-id="${urlParams?.['task_id']}"></span>`
        document.body.appendChild(tempHTML)
        kanbanTask.editTask($(tempHTML))
        $('.card-title', tempHTML).trigger('click')
    }

    // event on click tab task (task extend to other apps)
    $('#tab_task_nav').on('click', function () {
        let $table = $(`#${$('#tab_task_nav').attr('data-tbl-id')}`);
        let taskIDs = TaskExtend.getTaskIDsFromTbl($table);
        if (taskIDs.length > 0) {
            callDataTaskList(kanbanTask, listTask, {'id__in': taskIDs.join(',')});
        }
        $('#kb_scroll').css('max-height', 'none');
    });
    // event on click btn-list-task (task extend to other apps)
    $('#listTaskAssignedModal').on('shown.bs.modal', function () {
        let $table = $(`#${$(this).attr('data-tbl-id')}`);
        let rowIdx = $(this).attr('data-row-idx');
        let rowApi = $table.DataTable().row(rowIdx);
        let row = rowApi.node();
        let taskDataEle = row.querySelector('.table-row-task-data');
        if (taskDataEle) {
            if ($(taskDataEle).val()) {
                let taskIDs = [];
                let taskData = JSON.parse($(taskDataEle).val());
                for (let task of taskData) {
                    if (task?.['id']) {
                        taskIDs.push(task?.['id']);
                    }
                }
                if (taskIDs.length > 0) {
                    let callData = $.fn.callAjax2({
                        'url': $urlFact.attr('data-task-list'),
                        'method': 'GET',
                        'data': {'id__in': taskIDs.join(',')},
                        'isLoading': true
                    })
                    callData.then(
                        (req) => {
                            let data = $.fn.switcherResp(req);
                            if (data?.['status'] === 200) {
                                const taskList = data?.['task_list'];
                                listTask.init(listTask, taskList);
                            }
                        },
                        (err) => {
                            $.fn.notifyB({description: err.data.errors}, 'failure');
                        }
                    );
                }
            }
        }
    });

    // filter group animation
    $('#close_toggle').on('change', function(e){
        e.preventDefault()
        if ($(this).prop('checked')){
            $('.wrap-filter').addClass('show-less')
        }else $('.wrap-filter').removeClass('show-less')
    })

    // init flat pick
    $ElmDateRange.flatpickr({
        'allowInput': true,
        'altInput': true,
        'altFormat': 'd/m/Y',
        'dateFormat': 'Y-m-d',
        'locale': globeLanguage === 'vi' ? 'vn' : 'default',
        'mode': 'range',
        'position': 'auto',
        onReady: function (dObj, dStr, fp) {
            $(fp.element.nextSibling).attr('aria-label', $ElmDateRange.attr('name') + '_hidden')
                .attr('id', $ElmDateRange.attr('name') + '_hidden')
                .attr('tabindex', '-1')
        },
        onChange: function(selectedDates, dateStr) {
            const params = rtParams()
            const dateLst = dateStr.split(' ')
            if (dateLst && dateLst.length === 3) {
                $clearElm.addClass('d-inline-block')
                $ElmDateRange.addClass('isSelected')
            }
            else {
                $clearElm.removeClass('d-inline-block')
                $ElmDateRange.removeClass('isSelected')
            }
            GanttViewTask.CallFilter(params)
            callDataTaskList(kanbanTask, listTask, params)
        },
    })

}, jQuery);