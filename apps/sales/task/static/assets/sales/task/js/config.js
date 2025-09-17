$(function(){
    //declare global variable
    const $form = $('#formOpportunityTaskConfig')

    // get config detail
    WindowControl.showLoading();
    $.fn.callAjax2({
        url: $form.attr('data-url'),
        'method': 'GET'
    }).then(
        (resp) => {
            const $todoElm = $('#todo_list')
            let data = $.fn.switcherResp(resp);
            if (data?.['status'] === 200) {
                const config = data?.['task_config']
                $todoElm.html('')
                const itemSystem = []
                const itemEdit = []
                // separate item system and normal item
                for (let item of config.list_status){
                    if (item?.['is_edit']) itemEdit.push(item)
                    else itemSystem.push(item)
                }
                // loop item system and render
                for (let item of itemSystem){
                    let elm = $($('#item_config').html())
                    elm.addClass('ui-state-system')
                    elm.attr('data-id', item.id)
                    elm.find('.hand-drag, .icon-close').addClass('blur-35')
                    elm.find('.status_name').html(item.name)
                    elm.find('.is_finish input').prop('checked', item['is_finish'])
                    if (item?.task_color && item.task_color.length === 7)
                        elm.find('.picker_color').val(item.task_color)

                    $todoElm.append(elm)
                }
                // loop in normal item and render
                for (let item of itemEdit){
                    const positionCompleted = $('#todo_list li').length - 2
                    let elm = $($('#item_config').html())
                    elm.attr('data-id', item.id)
                    elm.find('.status_name').html(item.name)
                    elm.find('.is_finish input').prop(item['is_finish'])
                    if (item?.task_color && item.task_color.length === 7)
                        elm.find('.picker_color').val(item.task_color)
                    elm.insertBefore($('li', $todoElm).eq(positionCompleted))
                    $('.icon-close i', elm).off().on('click', function () {
                        $(this).closest('li').remove()
                    })
                }

                // normal config
                $todoElm.sortable({
                    items: "li.advance-list-item:not(.ui-state-system)",
                    placeholder: 'ui-state-highlight',
                    cancel: '.icon-close,[contenteditable]'
                });

                // init action checked input
                $('.is_finish input').on('change', function () {
                    $('.is_finish input').prop('checked', false)
                    this.checked = true
                })
                WindowControl.hideLoading();
                if (config?.['user_allow_group_handle']){
                    const $groupAssign = $('#group_assignee_list');
                    const selectedData = config['user_allow_group_handle']
                    let htmlStr = ''
                    for (let item in selectedData){
                        const value = selectedData[item]
                        htmlStr += `<option value="${item}" selected>${value.full_name}</option>`
                        value.selected = true;
                    }
                    $groupAssign.append(htmlStr).initSelect2()
                        .on('select2:select', function (e) {
                            const befData = $(this).data('employee_lst') || {}
                            const data = {
                                'id': e.params.data.id,
                                'full_name': e.params.data.data?.full_name || `${e.params.data.data?.first_name} ${e.params.data.data?.last_name}`
                            }
                            if (e.params.data.data?.group) data.group = {
                                'id': e.params.data.data.group.id,
                                'title': e.params.data.data.group.title
                            }
                            else data.group = {}
                            befData[e.params.data.id] = data
                            $(this).data('employee_lst', befData)
                        })
                        .on('select2:unselect', function (e) {
                            const befData = $(this).data('employee_lst') || {}
                            if (befData?.[e.params.data.id])
                                delete befData[e.params.data.id]
                            $(this).data('employee_lst', befData)
                        })
                }
            }
        },
        (errs) => WindowControl.hideLoading()
    );

    // add new item status
    $('.add_new_stt').on('click', function(){
        const $todoElm = $('#todo_list')
        let elm = $($('#item_config').html())
        const positionCompleted = $('#todo_list li').length - 2
        elm.insertBefore($('li', $todoElm).eq(positionCompleted))
        elm.find('.status_name').focus()
        $('.icon-close i', elm).off().on('click', function () {
            $(this).closest('li').remove();
        });
        elm.find('.status_name, .status_translate_name').off().on('blur', function(){
            if ($(this).text() === '') $(this).addClass('outline-err')
            else $(this).removeClass('outline-err')
        })
    });

    $form.on('submit', function(e){
        const $todoElm = $('#todo_list')
        WindowControl.showLoading();
        e.preventDefault();
        let list_status = []
        let order = 1
        $('li', $todoElm).each(function(){
            let $this = $(this)
            list_status.push({
                'id': $this.attr('data-id') ? $this.attr('data-id') : '',
                'order': order,
                'task_color': $('.picker_color', $this).val(),
                'name': $('.status_name', $this).text(),
                'translate_name': $('.status_translate_name', $this).text(),
                'is_finish': $('.is_finish input', $this).prop('checked'),
            })
            order += 1
        })
        let putData = {
            'list_status': list_status,
            'is_edit_date': $('#assignee_edit_date').prop('checked'),
            'is_edit_est': $('#assignee_edit_est').prop('checked'),
            'user_allow_group_handle': $('#group_assignee_list').data('employee_lst') || {}
        }
        $.fn.callAjax2({
            'url': $form.attr('data-url'),
            'method': 'PUT',
            'data': putData
        })
            .then(
                (resp) => {
                    const data = $.fn.switcherResp(resp);
                    if (data) {
                        WindowControl.hideLoading();
                        $.fn.notifyB({description: data.message}, 'success');
                    }
                }
            )
            .catch((err) => {
                WindowControl.hideLoading();
            })
    })
}, jQuery);