$(function(){
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

    // lấy danh sách status và render
    function getSttAndRender() {
        const config = JSON.parse($('#task_config').text());
        for (const item of config.list_status){
            let stt_template = $($('.card-parent_template').html());
            stt_template.find('.btn-add-newtask').attr('data-id', item.id)
            stt_template.find('.tasklist-name').text(item.name)
            stt_template.find('.task-count').text(item.count)
            stt_template.find('.wrap-child').attr('id', `taskID-${item.id}`)
            $('#tasklist_wrap').append(stt_template)
        }
    }

    // task util class
    class taskHandle {
        taskList = []
        set setTaskList(data){
            this.taskList = data
        }
        get getTaskList(){
            return this.taskList
        }


        getAndRenderTask (){
            $.fn.callAjax($urlFact.attr('data-task-list'),'GET')
                .then(
                    (req)=>{
                        let data = $.fn.switcherResp(req);
                        let taskByID = {}
                        if (data?.['status'] === 200) {
                            const taskList = data.task_list
                            this.setTaskList = taskList
                            let count_parent = {}
                            // loop trong ds gán cho template html gán vào object theo status ID
                            for (const item of taskList){
                                if (item.parent_n && Object.keys(item.parent_n).length)
                                    if (count_parent?.[item.id]) count_parent[item.id] += 1
                                    else count_parent[item.id] = 1
                                const getStrID = taskByID?.[item.task_status]
                                let childHTML = $($('.card-child_template').html());
                                childHTML.find('.card-code').text(item.code)
                                childHTML.find('.card-title').text(item.title).attr('data-task-id', item.id)
                                let priorityHTML = $($('.priority-badges').html())
                                priorityHTML.find('.badge-icon-wrap').text(item.priority === 0 ? '!' : item.priority === 1 ?
                                    '!!' : '!!!')
                                priorityHTML.addClass(`text-${priority_list[item.priority]}`)
                                childHTML.find('.card-priority').html(priorityHTML)
                                let date = moment(item.end_date, 'YYYY-MM-DD hh:mm:ss').format('YYYY/MM/DD')
                                childHTML.find('.task-deadline').text(date)
                                if (item.assign_to){
                                    const assign_to = item.assign_to

                                    const randomResource = randomColor[Math.floor(Math.random() * randomColor.length)];
                                    if (assign_to.avatar) childHTML.find('img').attr('src', assign_to.avatar)
                                    else{
                                        childHTML.find('img').remove()
                                        childHTML.find('.avatar').addClass('avatar-'+randomResource)
                                        const name = $.fn.shortName(assign_to.last_name + ' ' + assign_to.first_name)
                                        childHTML.find('.avatar .initial-wrap').text(name)
                                        childHTML.find('.avatar').attr('title', assign_to.last_name + ' ' + assign_to.first_name)
                                    }
                                }
                                if (item.checklist){
                                    const done = item.checklist.reduce((acc, obj)=> {
                                        if(obj.done) return acc++
                                        else return acc
                                    }, 0)
                                    const total = item.checklist.length
                                    childHTML.find('.checklist_progress').text(`${done}/${total}`)
                                }

                                if (getStrID === undefined){
                                    // chưa có task status trong string html
                                    taskByID[item.task_status] = childHTML.prop('outerHTML');
                                }
                                else{
                                    // đã có str stt trong string html
                                    taskByID[item.task_status] += childHTML.prop('outerHTML');
                                }
                            }

                            // loop trong danh sách status ID append HTMl cho task
                            $.each(taskByID, (key, value)=>{
                                let stsElm = $(`[data-id="${key}"]`).closest('.tasklist')
                                $('.wrap-child', stsElm).append(value)
                            })
                            // run tooltip cho avatar
                            $('[data-toggle="tooltip"]').tooltip({placement: 'right'});
                            // show các task nào có sub
                            for (let item in count_parent){
                                $(`[data-task-id="${item}"]`).closest('.tasklist-card').find('.sub_task_count').text(count_parent[item])
                            }
                        }
                    },
                    (err)=>{console.log('call data error, ', err)}
                );
        }

        init(){
          this.getAndRenderTask()
        }
    }

    // drag handle
    class dragHandle {
        init() {
            let dragArray = []
            $('.wrap-child').each(function () {
                if ($(this).attr('id') !== '') {
                    dragArray.push(this)
                }
            })
            dragula(dragArray);
        }
    }
/** ********************************************* **/
    // render column status của task
    getSttAndRender()
    // render task
    let objTask  = new taskHandle()
    objTask.init();

    // init dragula
    let objDarg = new dragHandle()
    objDarg.init()

    // Horizontal scroll
    new PerfectScrollbar('#kb_scroll', {
        suppressScrollY: true,
    });
}, jQuery);