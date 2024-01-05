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
                    // elm.find('.status_translate_name').html(item.translate_name)
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
                WindowControl.hideLoading();
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
            })
            order += 1
        })
        let putData = {
            'list_status': list_status,
            'is_edit_date': $('#assignee_edit_date').prop('checked'),
            'is_edit_est': $('#assignee_edit_est').prop('checked'),
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
                console.log(err)
                WindowControl.hideLoading();
            })
    })
}, jQuery);