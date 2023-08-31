$(function () {
    // declare variable
    const $urlFact = $('#url-factory');
    const priority_list = {
        0: 'success',
        1: 'warning',
        2: 'danger'
    }
    const randomColor = [
        "primary", "success", "warning", "danger", "info", "red", "green", "pink", "purple",
        "violet", "indigo", "blue", "sky", "cyan", "teal", "neon", "lime", "sun", "yellow", "orange", "pumpkin",
        "brown", "gold", "light", "dark"
    ]
    const $createBtn = $('.create-task')
    const $formElm = $('#formOpportunityTask')

    // lấy danh sách status và render
    function getSttAndRender() {
        const config = JSON.parse($('#task_config').text());
        for (const item of config.list_status) {
            let stt_template = $($('.card-parent_template').html());
            // for kanban main task
            stt_template.find('.btn-add-newtask').attr('data-id', item.id)
            stt_template.find('.tasklist-name').text(item.name).css('background-color', item.task_color)
            stt_template.find('.task-count').text(item.count)
            stt_template.find('.wrap-child').attr('id', `taskID-${item.id}`)
            $('#tasklist_wrap').append(stt_template)
            // create new task with default task status
            stt_template.find('.btn-add-newtask').off().on('click', function () {
                const currentData = {
                    'id': item.id,
                    'title': item.name
                }
                $('[data-drawer-target="#drawer_task_create"]').trigger('click')
                // activeDrawer('#drawer_task_create', $('.btn-add-newtask', stt_template));
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
        }
    }

    function countSTT() {
        $('#tasklist_wrap .tasklist').each(function () {
            const item = $('.wrap-child .tasklist-card', $(this)).length
            $(this).find('.task-count').text(item)
        })
    }

    function callDataTaskList(kanban, list){
        function callBackModalChange(mutations, observer){
            const checkHasClass = mutations[0].target.classList.contains('open');
            if (!checkHasClass){
                const _tableDataList = list.getTaskList
                for (let item of _tableDataList) {
                    if (item.edited) {
                        item.edited = false
                        break;
                    }
                }
                $('#table_task_list').DataTable().clear().rows.add(_tableDataList).draw()
            }
        }

        $.fn.callAjax2({'url': $urlFact.attr('data-task-list'), 'method': 'GET'})
            .then(
                (req) => {
                    let data = $.fn.switcherResp(req);
                    if (data?.['status'] === 200) {
                        const taskList = data.task_list
                        kanban.init(taskList)
                        list.init(list, taskList)
                        // Function to wait form create on submit
                        $createBtn.off().on('click', () => initCommon.awaitFormSubmit(kanban, list));
                        let observer = new MutationObserver(callBackModalChange);
                        const DOMCheck = document.getElementById('drawer_task_create')
                        observer.observe(DOMCheck, {attributeFilter: ['class']});
                    }
                },
                (err) => {
                    console.log('call data error, ', err)
                }
            );
    }

    class initCommon{
        static initTableLogWork(dataList){
            let $table = $('#table_log-work')
            if ($table.hasClass('dataTable')) {
                $table.DataTable().clear().draw();
                $table.DataTable().rows.add(dataList).draw();
            }
            else $table.DataTable({
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
                        render: (data, type, row) => {
                            let avatar = ''
                            const full_name = data.last_name + ' ' + data.first_name
                            if (data?.avatar)
                                avatar = `<img src="${data.avatar}" alt="user" class="avatar-img">`
                            else avatar = $.fn.shortName(full_name, '', 5)
                            const randomResource = randomColor[Math.floor(Math.random() * randomColor.length)];
                            return `<div class="avatar avatar-rounded avatar-xs avatar-${randomResource}">
                                        <span class="initial-wrap">${avatar}</span>
                                    </div>
                                    <span class="ml-2">${full_name}</span>`;
                        }
                    },
                    {
                        data: 'start_date',
                        targets: 1,
                        width: "35%",
                        render: (data, type, row) => {
                            let date = moment(data, 'YYYY-MM-DDThh:mm:ss').format('YYYY/MM/DD')
                            if (data !== row.end_date) {
                                date += ' ~ '
                                date += moment(row.end_date, 'YYYY-MM-DDThh:mm:ss').format('YYYY/MM/DD')
                            }
                            return date;
                        }
                    },
                    {
                        data: 'time_spent',
                        targets: 2,
                        width: "20%",
                        render: (data, type, row) => {
                            return data;
                        }
                    },
                    {
                        data: 'id',
                        targets: 3,
                        width: "10%",
                        render: (data, type, row) => {
                            return `<btn type="button" class="btn action act-edit" data-row-id="${data}"><i class="fa-solid fa-pencil"></i></btn>`;
                        }
                    }
                ]
            })
        }

        static renderSubtask(taskID, dataList){
            const $wrap = $('.wrap-subtask')
            let taskList = dataList
            let subTaskList = []
            const _this = this

            $wrap.html('')
            for (let [key, item] of taskList.entries()) {
                if (item.parent_n?.id === taskID) subTaskList.push(item)
            }
            if (subTaskList.length) {
                for (let [key, item] of subTaskList.entries()) {
                    const template = $(`<div class="d-flex justify-content-start align-items-center subtask_item">
                                    <p>${item.title}</p>
                                    <button class="btn btn-flush-primary btn-icon btn-rounded ml-auto flush-soft-hover">
                                        <span><i class="fa-regular fa-trash-can fa-sm"></i></span>
                                    </button>
                                 </div>`);
                    $wrap.append(template);
                    const subTaskID = item.id
                    template.find('button').off().on('click', function () {
                        const _isDelete = _this.deleteTaskAPI(subTaskID)
                        _isDelete.then((req) => {
                            let res = $.fn.switcherResp(req);
                            if (res?.['status'] === 200) {
                                //remove html in form
                                template.remove()
                                $(`[data-task-id="${subTaskID}"]`).parents('.tasklist-card').remove()
                                // get current task list and remove
                                let isIdx
                                for (let [key, item] of taskList.entries()) {
                                    if (item.id === subTaskID) {
                                        isIdx = key
                                        break
                                    }
                                }
                                taskList.splice(isIdx, 1)
                                _this.setTaskList = taskList
                                // reload count sub task in screen
                                _this.reloadCountParent()
                                // count number task in task status
                                countSTT()
                            }
                        })
                    })
                }
            }
        }

        static awaitFormSubmit(kanban, list){
            const isNewTask = setInterval(() => {
                const elmData = $('#addNewTaskData')
                const elmUpdate = $('#updateTaskData')
                if (elmData.length) {
                    // when created delete interval
                    clearInterval(isNewTask)
                    // parse data
                    const strData = JSON.parse(elmData.attr('data-task'))
                    // kanban handle new task created
                    kanban.waitDataCreated(strData)

                    // list view handle new task create
                    listViewTask.addNewData(list, strData)

                    elmData.remove();
                }
                else if (elmUpdate.length) {
                    clearInterval(isNewTask)
                    // parse data
                    const strData = JSON.parse(elmUpdate.attr('data-task'))

                    // get task has update and update for class task list
                    let taskData = kanban.getTaskList
                    let sameSTT = true
                    let old_stt
                    let idxTaskUpdate
                    for (let [idx, item] of taskData.entries()) {
                        if (item.id === strData.id) {
                            const itemTStt = item.task_status?.id ? item.task_status.id : item.task_status
                            const strTStt = strData.task_status?.id ? strData.task_status.id : strData.task_status
                            if (itemTStt !== strTStt) sameSTT = false
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
                }
            }, 1000)
        }

        static deleteTask(taskID){
            return $.fn.callAjax2({
                'url': $urlFact.attr('data-task-detail').format_url_with_uuid(taskID),
                'method': 'DELETE'
            })
        }
    }

    // task util class
    class kanbanHandle {
        taskList = []

        set setTaskList(data) {
            this.taskList = data
        }

        get getTaskList() {
            return this.taskList
        }

        reloadCountParent() {
            let currentList = this.taskList
            let countTemp = {}
            for (let [idx, item] of currentList.entries()) {
                if (item?.parent_n?.id)
                    countTemp[item.parent_n.id] = (countTemp[item.parent_n.id] || 0) + 1;
                else countTemp[item.id] = 0

            }
            for (let key in countTemp) {
                $(`[data-task-id="${key}"]`).parents('.tasklist-card').find('.sub_task_count').text(countTemp[key])
            }
        }

        showHideSubtask(newHTML = null) {
            let elm = $('.task-discuss')
            const _this = this
            if (newHTML) elm = newHTML.find('.task-discuss')
            elm.off().on('click', function () {
                // toggle Sub task layout
                if ($(this).hasClass('opened')) {
                    $(this).removeClass('opened')
                    $('#tab_block_1').removeClass('isOpened').css('min-height', 'auto')
                    // restore default
                    $('.tasklist-wrap .tasklist-card').removeClass('hidden')
                } else {
                    const $tab1 = $('#tab_block_1'), $subTaskWrap = $('.sub-tasklist-wrap')
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

                    const taskList = _this.getTaskList
                    for (let [key, item] of taskList.entries()) {
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
                    'method': 'GET'
                })
                    .then((req) => {
                        let data = $.fn.switcherResp(req);
                        if (data?.['status'] === 200) {
                            if (!$('#drawer_task_create').hasClass('open'))
                                $('[data-drawer-target="#drawer_task_create"]').trigger('click')
                            const taskIDElm = $(`<input type="hidden" name="id" value="${data.id}"/>`)
                            $formElm.append(taskIDElm)
                            $('#inputTextTitle').val(data.title)
                            $('#inputTextCode').val(data.code)
                            const stt = data.task_status
                            $('#selectStatus').attr('data-onload', JSON.stringify(stt)).initSelect2()
                            $('#inputTextStartDate').val(
                                moment(data.start_date, 'YYYY-MM-DD hh:mm:ss').format('DD/MM/YYYY')
                            )
                            $('#inputTextEndDate').val(
                                moment(data.end_date, 'YYYY-MM-DD hh:mm:ss').format('DD/MM/YYYY')
                            )
                            $('#inputTextEstimate').val(data.estimate)
                            if (data?.opportunity_data && Object.keys(data.opportunity_data).length)
                                $('#selectOpportunity')
                                    .attr(
                                        'data-onload',
                                        JSON.stringify({
                                                "id": data.opportunity_data.id,
                                                "code": data.opportunity_data.code
                                            }
                                        )
                                    )
                                    .html('')
                                    .initSelect2()
                            $('#selectPriority').val(data.priority).trigger('change')
                            window.formLabel.renderLabel(data.label)
                            $('#inputLabel').attr('value', JSON.stringify(data.label))
                            $('#inputAssigner').val(data.employee_created.last_name + '. ' + data.employee_created.first_name)
                                .attr('value', data.employee_created.id)
                            if (data?.assign_to) {
                                data.assign_to.full_name = `${data.assign_to.last_name}. ${data.assign_to.first_name}`
                                $('#selectAssignTo').html('').attr('data-onload', JSON.stringify(data.assign_to))

                                const isConfig = JSON.parse($('#task_config').text())
                                AssignToSetup.hasConfig(isConfig)
                            }
                            window.editor.setData(data.remark)
                            window.checklist.setDataList = data.checklist
                            window.checklist.render()
                            $formElm.addClass('task_edit')
                            if (Object.keys(data.parent_n).length <= 0) $('.create-subtask').removeClass('hidden')
                            else $('.create-subtask').addClass('hidden')
                            if (data.task_log_work.length) initCommon.initTableLogWork(data.task_log_work)
                            initCommon.renderSubtask(data.id, _this.getTaskList)

                            if (data.attach) {
                                const fileDetail = data.attach[0]?.['files']
                                FileUtils.init($(`[name="attach"]`).siblings('button'), fileDetail);
                            }
                        }
                    })
            })
            // destroy element after run click function
            newTaskElm = null
        }

        // delete a task
        deleteTask(newTaskElm = null, subTaskID = null) {
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
                        _this.reloadCountParent()
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
                let taskStatus = ''
                // loop in newTask object
                taskStatus = newData.task_status
                childHTML.find('.card-code').text(newData.code)
                childHTML.find('.card-title').text(newData.title).attr('data-task-id', newData.id).attr('title',
                    newData.title)
                let priorityHTML = $($('.priority-badges').html())
                priorityHTML.find('.badge-icon-wrap').text(newData.priority === 0 ? '!' : newData.priority === 1 ?
                    '!!' : '!!!')
                priorityHTML.addClass(`text-${priority_list[newData.priority]}`)
                childHTML.find('.card-priority').html(priorityHTML)
                let date = moment(newData.end_date, 'YYYY-MM-DD hh:mm:ss').format('YYYY/MM/DD')
                childHTML.find('.task-deadline').text(date)
                const assign_to = newData.assign_to
                if (Object.keys(assign_to).length > 0) {
                    const randomResource = randomColor[Math.floor(Math.random() * randomColor.length)];
                    if (assign_to.avatar) childHTML.find('img').attr('src', assign_to.avatar)
                    else {
                        childHTML.find('img').remove()
                        childHTML.find('.avatar').addClass('avatar-' + randomResource)
                        const full_name = `${assign_to.last_name} ${assign_to.first_name}`
                        const name = $.fn.shortName(full_name, '', 5)
                        childHTML.find('.avatar .initial-wrap').text(name)
                        childHTML.find('.avatar').attr('title', full_name)
                    }
                } else childHTML.find('.avatar').addClass('visible-hidden')
                if (newData.checklist) {
                    let done = newData.checklist.reduce((acc, obj) => {
                        if (obj.done) return acc += 1
                        else return acc
                    }, 0)
                    const total = newData.checklist.length
                    childHTML.find('.checklist_progress').text(`${done}/${total}`)
                }
                if (newData.attach) {
                    const fileDetail = newData.attach[0]?.['files']
                    FileUtils.init($(`[name="attach"]`, childHTML).siblings('button'), fileDetail);
                }

                if (newData.parent_n && Object.keys(newData?.parent_n).length)
                    childHTML.find('.task-discuss').remove()

                if (isReturn) return childHTML
                else {
                    const taskStatusID = taskStatus.id
                    const $thisCrt = this
                    $(`[data-id="${taskStatusID}"]`).closest('.tasklist').find('.wrap-child').each(function () {
                        let temp = childHTML.clone()
                        $(this).append(temp)
                        if ($(this).closest('#kb_scroll').length > 0) temp.removeClass('hidden')

                        temp.find('[data-toggle="tooltip"]').tooltip({placement: 'right'});
                        $thisCrt.editTask(temp)
                        $thisCrt.deleteTask(temp)
                        $thisCrt.logTimeAct(temp)
                        $thisCrt.showHideSubtask(temp)
                    })
                    $('.cancel-task').trigger('click')
                    // reload lại các sub
                    this.reloadCountParent()
                    // đếm lại số task trong task status
                    countSTT()

                }
            }
        }

        // on page loaded render task list for task status
        getAndRenderTask(data) {
            let taskByID = {};
            const taskList = data
            this.setTaskList = taskList
            let count_parent = {}
            // loop trong ds gán cho template html gán vào object theo status ID
            for (const item of taskList) {
                if (item.parent_n && Object.keys(item.parent_n).length)
                    if (count_parent?.[item.parent_n.id]) count_parent[item.parent_n.id] += 1
                    else count_parent[item.parent_n.id] = 1
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
            $('[data-toggle="tooltip"]').tooltip({placement: 'right'});

            // show các task nào có sub
            for (let item in count_parent) {
                $(`[data-task-id="${item}"]`).closest('.tasklist-card').find('.sub_task_count').text(
                    count_parent[item])
            }
        }

        // re-render new data for old task
        afterUpdate(data) {
            const $elm = $(`[data-task-id="${data.id}"]`).parents('.tasklist-card')
            $elm.find('.badge-icon-wrap').text(data.priority === 0 ? '!' : data.priority === 1 ?
                '!!' : '!!!')
            $elm.find('.badge-icon').removeClass('text-success text-warning text-danger')
            $elm.find('.badge-icon').addClass(`text-${priority_list[data.priority]}`)
            $elm.find('.card-title').text(data.title).attr('title', data.title)
            if (data.assign_to) {
                const assign_to = data.assign_to
                if (assign_to.avatar) $elm.find('img').attr('src', assign_to.avatar)
                else {
                    $elm.find('img').remove()
                    const name = $.fn.shortName(assign_to.last_name + ' ' + assign_to.first_name)
                    $elm.find('.avatar .initial-wrap').text(name)
                    $elm.find('.avatar').attr('title', assign_to.last_name + ' ' + assign_to.first_name)
                }
            }
            if (data.checklist) {
                let done = data.checklist.reduce((acc, obj) => {
                    if (obj.done) return acc += 1
                    else return acc
                }, 0)
                const total = data.checklist.length
                $elm.find('.checklist_progress').text(`${done}/${total}`)
            }
            const date = moment(data.end_date, 'YYYY-MM-DD hh:mm:ss').format('YYYY/MM/DD')
            $elm.find('.task-deadline').text(date)
            const hasSub = this.getCountParent
            if (hasSub?.[data.id])
                $elm.find('.sub_task_count').text(hasSub[data.id])
            $('.cancel-task').trigger('click')
            // reload sub count
            this.reloadCountParent()
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
                const $oppElm = $('#selectOpportunity')
                let oppData = {}
                if ($oppElm.val()) {
                    oppData = {
                        "id": $oppElm.select2('data')[0].id,
                        "title": $oppElm.select2('data')[0].text,
                    }
                }
                if (taskID) {
                    resetFormTask()
                    // after reset
                    $formElm.append(`<input type="hidden" name="parent_n" value="${taskID}"/>`)
                    if (Object.keys(oppData).length)
                        $oppElm.attr('data-onload', JSON.stringify(oppData)).attr('disabled', true)
                    else $oppElm.removeAttr('data-onload')
                    $oppElm.initSelect2()
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
            this.getAndRenderTask(data);
            this.createSubTask();
        }
    }

    // drag handle
    class dragHandle {
        onDrop(el, target, source, isSub = false) {
            const dataSttUpdate = {
                "id": $(el).find('.card-title').attr('data-task-id'),
                "task_status": $(target).attr('id').split('taskID-')[1],
            }
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
                                $(taskEl).appendTo($(`#${taskTargetID}`))
                            } else {
                                const taskTargetID = $(target).attr('id')
                                const taskEl = $(`[data-task-id="${taskID}"]`, '#sub-tasklist_wrap').closest('.tasklist-card')
                                $(taskEl).appendTo($(`#sub-${taskTargetID}`))
                            }
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

    class listViewTask {

        constructor() {
            this.taskConfig = '';
            this.taskList = [];
        }

        set setConfig(data) {
            this.taskConfig = data
        };

        set setTaskList(data) {
            this.taskList = data
        }

        get getTaskList() {
            return this.taskList
        }

        get getConfig(){
            return this.taskConfig
        }

        init(cls, data) {
            this.setTaskList = data
            listViewTask.initTaskConfig(cls)
            listViewTask.renderTable(cls)
        }

        static initTaskConfig(cls) {
            cls.setConfig = JSON.parse($('#task_config').text());
        }

        static appendDataToForm(cls, $form, taskID){
            $.fn.callAjax2({
                "url": $urlFact.attr('data-task-detail').format_url_with_uuid(taskID),
                "method": "get"
            }).then(
                (req) => {
                    const data = $.fn.switcherResp(req)
                        if (data.status === 200) {
                            $('#inputTextTitle', $form).val(data.title)
                            $('#inputTextCode', $form).val(data.code)
                            $('#selectStatus', $form).attr('data-onload', JSON.stringify(data.task_status))
                            const taskIDElm = $(`<input type="hidden" name="id" value="${data.id}"/>`)
                            $formElm.append(taskIDElm).addClass('task_edit')
                            $('#inputTextStartDate', $form).val(
                                moment(data.start_date, 'YYYY-MM-DD hh:mm:ss').format('DD/MM/YYYY')
                            )
                            $('#inputTextEndDate', $form).val(
                                moment(data.end_date, 'YYYY-MM-DD hh:mm:ss').format('DD/MM/YYYY')
                            )
                            $('#inputTextEstimate', $form).val(data.estimate)
                            if (data.opportunity_data?.id)
                                $('#selectOpportunity', $form).attr('data-onload', JSON.stringify(data.opportunity_data))
                            $('#selectPriority', $form).val(data.priority).trigger('change')

                            $('#inputAssigner', $form).val(
                                data.employee_created.last_name +'. '+ data.employee_created.first_name)
                                .attr('data-value-id', data.employee_created.id)
                                .attr('value', data.employee_created.id)

                            $('#selectAssignTo', $form).attr('data-onload', JSON.stringify({
                                "full_name": data.assign_to.last_name + '. ' + data.assign_to.first_name,
                                ...data.assign_to
                            }
                            ))
                            $('#selectStatus, #selectOpportunity, #selectAssignTo', $form).each(function(){
                                $(this).html('')
                                $(this).initSelect2()
                            })
                            window.formLabel.renderLabel(data.label)
                            window.editor.setData(data.remark)
                            window.checklist.setDataList = data.checklist
                            window.checklist.render()

                            if (data.attach) {
                                const fileDetail = data.attach[0]?.['files']
                                FileUtils.init($(`[name="attach"]`).siblings('button'), fileDetail);
                            }
                            initCommon.initTableLogWork(data.task_log_work)
                            initCommon.renderSubtask(data.id, cls.getTaskList)
                        }

                },
                (errs) => {
                     $.fn.notifyB({description: errs.data.errors}, 'failure')
                }
            )

        }

        static actionClickBtn(cls, row, data, index){
            let tbl = $('#table_task_list')
            if(data.edited) {
                $('.cancel-task').trigger('click')
                data.edited = false
                tbl.DataTable().cell(index, 6).data(data.edited).draw(true)
            }
            else{
                const allData = cls.getTaskList
                let infoOld
                allData.map((item, idx) => {
                        if (item.edited === true) infoOld = idx
                        item.edited = false
                    }
                )
                if (!$('.hk-wrapper').hasClass('open'))
                    $('[data-drawer-target="#drawer_task_create"]').trigger('click')
                allData[index].edited = true
                cls.setTaskList = allData
                if (typeof infoOld === 'number')  // case click task khác mà chưa đóng task cũ
                    tbl.DataTable().cell(infoOld, 6).data(false).draw(false)
                tbl.DataTable().cell(index, 6).data(true).draw(false)
                listViewTask.appendDataToForm(cls, $('#formOpportunityTask'), data.id)
            }
        }

        static renderTable(cls) {
            const dataList = cls.getTaskList
            const $tblElm = $('#table_task_list')
            $tblElm.DataTableDefault({
                "data": dataList,
                "columns": [
                    {
                        "data": 'title',
                        "class": "col-3",
                        render: (row, type, data) => {
                            return `<span class="mr-2">${row ? row : "_"}</span>` +
                                '<span class="badge badge-primary badge-indicator-processing badge-indicator" style="margin-top: -1px;"></span>'
                                + `<span class="ml-2 font-weight-bold">${data.code}</span>`
                        }
                    },
                    {
                        "data": 'priority',
                        "class": 'w-5',
                        render: (row, type, data) => {
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
                        render: (row, type, data)=> {
                            const config = cls.getConfig
                            let html = $('<span class="badge text-dark font-2">')
                            for (let cf of config.list_status){
                                if (cf.id === row.id){
                                    html.css('background-color', cf.task_color).text(row.title)
                                    break;
                                }
                            }
                            return html.prop('outerHTML')
                        }
                    },
                    {
                        "data": "assign_to",
                        "class": "col-2 text-right",
                        render: (row, type, data) => {
                            let html = ''
                            if (!data.employee_created?.full_name)
                                data.employee_created.full_name = data.employee_created.last_name +
                                    ' ' + data.employee_created.first_name
                            const assigner = $x.fn.renderAvatar(data.employee_created)
                            let assignee = ''
                            if (row){
                                if (!row.full_name) row.full_name = row.last_name + ' ' + row.first_name
                                assignee = $x.fn.renderAvatar(row)
                            }
                            html += assigner + '<supper>»</supper>' + assignee
                            return html
                        }
                    },
                    {
                        "data": "date_created",
                        "class": "col-1",
                        render: (row, type, data)=>{
                            if (!row) row = new Date()
                            return `<span>${$x.fn.parseDate(row)}<span>`
                        }
                    },
                    {
                        "data": "opportunity",
                        "class": "col-1",
                        render: (row, type, data) =>{
                            let html = '--';
                            if (row?.code) html = `<span>${row.code}</span>`
                            return html
                        }
                    },
                    {
                        "class": "col-1 text-center",
                        render: (row, type, data) =>{
                            const isEdit = data?.edited ? data.edited : false;
                            let $btn = $('<div><button class="btn btn_task-list-action btn-icon btn-rounded bg-dark-hover" type="button"></button></div>')
                            $btn.find('button').html(`<span class="icon"><i class="fa-regular ${isEdit ? 'fa-eye' : 'fa-eye-slash'}"></i></span>`)
                            $btn.append(`<div class="list_act-wrap">${
                                $('.card-child_template .card-action-wrap').html()}</div>`)
                            return $btn.prop('outerHTML')
                        }
                    }
                ],
                rowCallback: (row, data, index)=>{
                    $('.avatar', row).tooltip({placement: 'top'})

                    // click view task list
                    $('.btn_task-list-action', row).off().on('click', function(){
                        listViewTask.actionClickBtn(cls, row, data, index)
                    })
                    // click delete
                    $('.del-task-act', row).off().on('click', function(){
                        listViewTask.deleteTask(cls, data, index)
                    })
                    // click logwork
                    $('.log-task-act', row).off().on('click', function(){
                        const elmTaskID = $('#logtime_task_id')
                        $('#startDateLogTime, #endDateLogTime, #EstLogtime').val(null)
                        $($(this).attr('href')).modal('show')
                        elmTaskID.val(data.id)
                    })
                }
            }).on('draw.dt', function () {
                $tblElm.find('tbody').find('tr').each(function () {
                    $(this).after('<tr class="table-row-gap"><td></td></tr>');
                });
            });
        }

        static addNewData(cls, newData){
            let currentList = cls.getTaskList
            currentList.push(newData)
            const $tblElm = $('#table_task_list')
            $tblElm.DataTable().row.add(newData).draw()
        }

        static deleteTask(cls, row, data, index){
            let req = initCommon.deleteTask(data.id)
            req.then((resp)=> {
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

        static updateTask(cls, data, index){
            const tbl = $('#table_task_list')
            let dataCurrent = cls.getTaskList
            dataCurrent[index] = data
            cls.setTaskList = dataCurrent
            tbl.DataTable().clear().row(index).data(data).draw(true)
        }
    }

    /** ********************************************* **/
    // render column status của task
    getSttAndRender()
    // render task
    const kanbanTask = new kanbanHandle()
    const listTask = new listViewTask()
    callDataTaskList(kanbanTask, listTask)
    // on click save btn log work
    logworkSubmit()
    // init dragula
    let objDrag = new dragHandle()
    objDrag.init()

    // Horizontal scroll
    new PerfectScrollbar('#kb_scroll, #kb_sub_scroll', {
        suppressScrollY: true,
    });
}, jQuery);