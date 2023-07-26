$(function () {
    // declare variable
    const $urlFact = $('#url-factory');
    const priority_list = {
        0: 'success',
        1: 'warning',
        2: 'danger'
    }
    const randomColor = ["primary", "success", "warning", "danger", "info", "red", "green", "pink", "purple",
        "violet", "indigo", "blue", "sky", "cyan", "teal", "neon", "lime", "sun", "yellow", "orange", "pumpkin",
        "brown", "gold", "light", "dark"]
    const $createBtn = $('.create-task')
    const $formElm = $('#formOpportunityTask')

    // lấy danh sách status và render
    function getSttAndRender() {
        const config = JSON.parse($('#task_config').text());
        for (const item of config.list_status) {
            let stt_template = $($('.card-parent_template').html());
            // for kanban main task
            stt_template.find('.btn-add-newtask').attr('data-id', item.id)
            stt_template.find('.tasklist-name').text(item.name)
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
                $('#selectStatus').attr('data-onload', JSON.stringify(currentData))
                initSelectBox($('#selectStatus'))

            })

            // for kanban sub-task
            let cloneHTML = stt_template.clone()
            cloneHTML.find('.card-header').addClass('hidden')
            cloneHTML.find('.wrap-child').attr('id', `sub-taskID-${item.id}`)
            $('#sub-tasklist_wrap').append(cloneHTML)
        }
    }
    
    function countSTT() {
        $('#tasklist_wrap .tasklist').each(function(){
            const item = $('.wrap-child .tasklist-card', $(this)).length
            $(this).find('.task-count').text(item)
        })
    }
    // task util class
    class taskHandle {
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

        deleteTaskAPI(taskID) {
            return $.fn.callAjax(
                $urlFact.attr('data-task-detail').format_url_with_uuid(taskID),
                'DELETE',
                {},
                true
            )
        }

        renderLogWork(logWorkList) {
            // reset datatable
            let $table = $('#table_log-work')
            if ($table.hasClass('datatable')) $table.DataTable().clear().draw();
            $table.DataTable({
                searching: false,
                ordering: false,
                paginate: false,
                info: false,
                data: logWorkList,
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

        renderSubtask(taskID) {
            // render subtask in history tabs of FORM edit.
            const $wrap = $('.wrap-subtask')
            const taskList = this.getTaskList
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

        showHideSubtask(newHTML=null){
            let elm = $('.task-discuss')
            const _this = this
            if (newHTML) elm = newHTML.find('.task-discuss')
            elm.off().on('click', function () {
                // toggle Sub task layout
                if ($(this).hasClass('opened')){
                    $(this).removeClass('opened')
                    $('#tab_block_1').removeClass('isOpened').css('min-height', 'auto')
                    // restore default
                    $('.tasklist-wrap .tasklist-card').removeClass('hidden')
                }else {
                    const $tab1 = $('#tab_block_1'), $subTaskWrap = $('.sub-tasklist-wrap')
                    $(this).addClass('opened')
                    $tab1.addClass('isOpened')
                    let distanceBt = $(document).height() - $tab1.offset().top
                    $tab1.css( 'min-height', `${distanceBt}px`)
                    $subTaskWrap.css('min-height',
                        `${distanceBt - $('.tasklist-wrap').outerHeight()}px`
                        )
                    const taskID = $(this).parents('.tasklist-card').find('.card-title').attr('data-task-id')
                    // show/hide parent-task and child-task
                    $('.tasklist-card').addClass('hidden')
                    $(this).parents('.tasklist-card').removeClass('hidden')

                    const taskList = _this.getTaskList
                    for (let [key, item] of taskList.entries()){
                        if (item.parent_n.id === taskID)
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
            elm.off().on('click', function () {
                const taskID = $(this).attr('data-task-id')
                $.fn.callAjax($urlFact.attr('data-task-detail').format_url_with_uuid(taskID), 'GET')
                    .then((req) => {
                        let data = $.fn.switcherResp(req);
                        if (data?.['status'] === 200) {
                            if (!$('#drawer_task_create').hasClass('open'))
                                $('[data-drawer-target="#drawer_task_create"]').trigger('click')
                            const taskIDElm = $(`<input type="hidden" name="id" value="${data.id}"/>`)
                            $('#formOpportunityTask').append(taskIDElm)
                            $('#inputTextTitle').val(data.title)
                            $('#inputTextCode').val(data.code)
                            const stt = data.task_status
                            $('#selectStatus').attr('data-onload', JSON.stringify(stt))
                            $('#inputTextStartDate').val(
                                moment(data.start_date, 'YYYY-MM-DD hh:mm:ss').format('DD/MM/YYYY')
                            )
                            $('#inputTextEndDate').val(
                                moment(data.end_date, 'YYYY-MM-DD hh:mm:ss').format('DD/MM/YYYY')
                            )
                            $('#inputTextEstimate').val(data.estimate)
                            if (data?.opportunity_data && Object.keys(data.opportunity_data).length)
                                $('#selectOpportunity').attr('data-onload', JSON.stringify({
                                    "id": data.opportunity_data.id,
                                    "title": data.opportunity_data.code
                                }))
                            $('#selectPriority').val(data.priority).trigger('change')
                            window.formLabel.renderLabel(data.label)
                            $('#inputLabel').attr('value', JSON.stringify(data.label))
                            $('#inputAssigner').val(data.employee_created.last_name + '. ' + data.employee_created.first_name)
                                .attr('value', data.employee_created.id)
                            if (data.assign_to.length)
                                $('#selectAssignTo').attr('data-onload', JSON.stringify(data.assign_to))
                            window.editor.setData(data.remark)
                            window.checklist.setDataList = data.checklist
                            window.checklist.render()
                            initSelectBox($('#selectOpportunity, #selectAssignTo, #selectStatus'))
                            $formElm.addClass('task_edit')
                            if (Object.keys(data.parent_n).length <= 0) $('.create-subtask').removeClass('hidden')
                            else $('.create-subtask').addClass('hidden')
                            if (data.task_log_work.length) _this.renderLogWork(data.task_log_work)
                            _this.renderSubtask(data.id)

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
                const callDelete = _this.deleteTaskAPI(taskID)
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
                        $.fn.notifyPopup({description: res.message}, 'success')
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
                if (Object.keys(assign_to).length) {
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
                if (newData.attach){
                    const fileDetail = newData.attach[0]?.['files']
                    FileUtils.init($(`[name="attach"]`, childHTML).siblings('button'), fileDetail);
                }

                if(Object.keys(newData.parent_n).length)
                    childHTML.find('.task-discuss').remove()

                if (isReturn) return childHTML
                else {
                    const taskStatusID = taskStatus.id
                    $(`[data-id="${taskStatusID}"]`).closest('.tasklist').find('.wrap-child').append(childHTML)
                    $('.cancel-task').trigger('click')
                    childHTML.find('[data-toggle="tooltip"]').tooltip({placement: 'right'});
                    this.editTask(childHTML)
                    this.deleteTask(childHTML)
                    this.logTimeAct(childHTML)
                    this.showHideSubtask(childHTML)
                    // reload lại các sub
                    this.reloadCountParent()
                    // đếm lại số task trong task status
                    countSTT()

                }
            }
        }

        // on page loaded render task list for task status
        getAndRenderTask() {
            $.fn.callAjax($urlFact.attr('data-task-list'), 'GET')
                .then(
                    (req) => {
                        let data = $.fn.switcherResp(req);
                        let taskByID = {}
                        if (data?.['status'] === 200) {
                            const taskList = data.task_list
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
                    },
                    (err) => {
                        console.log('call data error, ', err)
                    }
                );
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

            // reload sub count
            this.reloadCountParent()
            // đếm lại số task trong task status
            countSTT()
        }

        // async form create is done listening event then of ajax create/update
        waitDataCreated() {
            const isNewTask = setInterval(() => {
                const elmData = $('#addNewTaskData')
                const elmUpdate = $('#updateTaskData')
                if (elmData.length) {
                    // when created delete interval
                    clearInterval(isNewTask)
                    // parse data
                    const strData = JSON.parse(elmData.attr('data-task'))

                    // get before data parse and push new task has added by user
                    let taskData = this.getTaskList
                    taskData.push(strData)
                    this.setTaskList = taskData

                    // call func to render new task added before
                    this.addNewTask(strData)
                    elmData.remove();
                } else if (elmUpdate.length) {
                    clearInterval(isNewTask)
                    // parse data
                    const strData = JSON.parse(elmUpdate.attr('data-task'))

                    // get task has update and update for class task list
                    let taskData = this.getTaskList
                    let sameSTT = true
                    let old_stt
                    for (let [idx, item] of taskData.entries()) {
                        if (item.id === strData.id) {
                            const itemTStt = item.task_status?.id ? item.task_status.id : item.task_status
                            const strTStt = strData.task_status?.id ? strData.task_status.id : strData.task_status
                            if (itemTStt !== strTStt) sameSTT = false
                            old_stt = itemTStt
                            taskData[idx] = strData
                            break
                        }
                    }
                    this.setTaskList = taskData
                    // update data to task kanban after
                    if (sameSTT) this.afterUpdate(strData)
                    else {
                        this.addNewTask(strData)
                        $(`[data-id="${old_stt}"]`).parents('.tasklist').find($(`[data-task-id="${strData.id}"]`))
                            .parents('.tasklist-card').remove()
                    }
                }
            }, 1000)
        }

        // create sub task
        createSubTask() {
            const $btnCreateSub = $('.create-subtask')
            $btnCreateSub.off().on('click', function () {
                // call form create-task.js
                const taskID = $(this).closest('form').find('[name="id"]').val()
                const $oppElm = $('#selectOpportunity')
                let oppData = {}
                if ($oppElm.val()){
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
                    initSelectBox($oppElm)
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
            // on click save btn log work
            logworkSubmit()

        }

        init() {
            this.getAndRenderTask();
            // Function to wait form create on submit
            $createBtn.off().on('click', () => this.waitDataCreated());
            this.createSubTask();
        }
    }

    // drag handle
    class dragHandle {
        onDrop(el, target, source, isSub=false){
            const dataSttUpdate = {
                "id": $(el).find('.card-title').attr('data-task-id'),
                "task_status": $(target).attr('id').split('taskID-')[1],
            }
            $.fn.callAjax($urlFact.attr('data-change-stt'), 'PUT', dataSttUpdate, true)
                .then(
                    (req) => {
                        const res = $.fn.switcherResp(req)
                        if (res.status === 200){
                            const taskID = $('.card-title', el).attr('data-task-id')
                            if (isSub){
                                const taskTargetID = $(target).attr('id').split('sub-')[1]
                                const taskEl = $(`[data-task-id="${taskID}"]`, '#tasklist_wrap').closest('.tasklist-card')
                                // nếu kéo task từ sub -> lấy task ẩn của task chính kéo sang cột tương ứng
                                $(taskEl).appendTo($(`#${taskTargetID}`))
                            }else{
                                const taskTargetID = $(target).attr('id')
                                const taskEl = $(`[data-task-id="${taskID}"]`, '#sub-tasklist_wrap').closest('.tasklist-card')
                                $(taskEl).appendTo($(`#sub-${taskTargetID}`))
                            }
                            countSTT()
                        }
                        else drake.cancel(el)
                    },
                    (errs) => {
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

    /** ********************************************* **/
    // render column status của task
    getSttAndRender()
    // render task
    let objTask = new taskHandle()
    objTask.init();

    // init dragula
    let objDarg = new dragHandle()
    objDarg.init()

    // Horizontal scroll
    new PerfectScrollbar('#kb_scroll, #kb_sub_scroll', {
        suppressScrollY: true,
    });
}, jQuery);