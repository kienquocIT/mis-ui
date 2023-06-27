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
        "brown", "gray", "gold", "smoke", "light", "dark"]

    // lấy danh sách status và render
    function getSttAndRender() {
        const config = JSON.parse($('#task_config').text());
        for (const item of config.list_status){
            let stt_template = $($('.card-parent_template').html());
            stt_template.find('.btn-add-newtask').attr('data-id', item.id)
            stt_template.find('.tasklist-name').text(item.name)
            stt_template.find('.task-count').text(item.count)
            $('#tasklist_wrap').append(stt_template)
        }
    }

    // lấy danh sách task và render vào trong từng status
    function getAndRenderTask (){
        $.fn.callAjax($urlFact.attr('data-task-list'),'GET')
            .then(
                (req)=>{
                    let data = $.fn.switcherResp(req);
                    let taskByID = {}
                    if (data?.['status'] === 200) {
                        const taskList = data.task_list
                        // loop trong ds gán cho template html gán vào object theo status ID
                        for (const item of taskList){
                            const getStrID = taskByID?.[item.task_status]
                            let childHTML = $($('.card-child_template').html());
                            childHTML.find('.card-code').text(item.code)
                            childHTML.find('.card-title').text(item.title)
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
                            if (item.parent_n){

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
                        $('[data-toggle="tooltip"]').tooltip({placement: 'right'});
                    }
                },
                (err)=>{console.log('call data error, ', err)}
            );
    }

    // init func queue
    // render column status của task
    getSttAndRender()
    // render task
    getAndRenderTask();






    // dragula([document.getElementById("i1"), document.getElementById("i2"), document.getElementById("i3"), document.getElementById("i4")]);
    // const ps = new PerfectScrollbar('#kb_scroll', {
    //     suppressScrollY: true,
    // });
}, jQuery);