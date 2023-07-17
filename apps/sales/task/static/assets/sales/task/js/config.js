$(function(){
    //declare global variable
    const $form = $('#formOpportunityTaskConfig')

    // get config detail
    $.fn.showLoading();
    $.fn.callAjax($form.attr('data-url'),'GET',).then(
        (resp) => {
            const $todoElm = $('#todo_list')
            let data = $.fn.switcherResp(resp);
            if (data?.['status'] === 200) {
                const config = data.task_config
                $todoElm.html('')
                const itemSystem = []
                const itemEdit = []
                // separate item system and normal item
                for (let item of config.list_status){
                    if (item.is_edit) itemEdit.push(item)
                    else itemSystem.push(item)
                }
                // loop item system and render
                for (let item of itemSystem){
                    let elm = $($('#item_config').html())
                    elm.addClass('ui-state-system')
                    elm.find('.hand-drag, .icon-close').addClass('blur-35')
                    elm.find('.status_name, .status_translate_name').attr('contenteditable', false)
                    elm.find('.status_name').html(item.name)
                    // elm.find('.status_translate_name').html(item.translate_name)
                    if (item?.task_color && item.task_color.length === 7)
                        elm.find('.picker_color').val(item.task_color).attr('disabled', true)
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
                $('#assignee_edit_date').prop('checked', config.is_edit_date)
                $('#assignee_edit_est').prop('checked', config.is_edit_est)
                $('#in_assign_any').prop('checked', config.is_in_assign)
                if (config.in_assign_opt !== 0)
                    $(`[name="in_assign_opt"][value="${config.in_assign_opt}"]`).prop('cheked', true)
                $('#out_assign_any').prop('checked', config.is_out_assign)
                if (config.out_assign_opt !== 0)
                    $(`[name="in_assign_opt"][value="${config.out_assign_opt}"]`).prop('cheked', true)
                $todoElm.sortable({
                    items: "li.advance-list-item:not(.ui-state-system)",
                    placeholder: 'ui-state-highlight',
                    cancel: '.icon-close,[contenteditable]'
                });
                $.fn.hideLoading();
            }
        },
        (errs) => {
            $.fn.hideLoading();
        }
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

    // block assign in Opp
    $('#in_assign_any').on('change', function(){
        if (!this.checked){
            $('[name="in_assign_opt"]').prop('disabled', false)
        }else $('[name="in_assign_opt"]').prop('disabled', true).prop('checked', false)
    })
    // block assign over Opp
    $('#out_assign_any').on('change', function(){
        if (!this.checked){
            $('[name="out_assign_opt"]').prop('disabled', false)
        }else $('[name="out_assign_opt"]').prop('disabled', true).prop('checked', false)
    })

    $form.on('submit', function(e){
        const $todoElm = $('#todo_list')
        $.fn.showLoading();
        e.preventDefault();
        let list_status = []
        let order = 1
        $('li', $todoElm).each(function(){
            let $this = $(this)
            if (!$this.hasClass('ui-state-system')){
                list_status.push({
                    'id': $this.attr('data-id') ? $this.attr('data-id') : '',
                    'name': $('.status_name', $this).text(),
                    'translate_name': $('.status_translate_name', $this).text(),
                    'order': order,
                    'task_color': $('.picker_color', $this).val(),
                })
            }
            order += 1
        })
        let inOpt = 0, $inOpt = $('[name="in_assign_opt"]:checked');
        if ($inOpt.length) inOpt = $inOpt.val()
        let outOpt = 0, $outOpt = $('[name="out_assign_opt"]:checked');
        if ($outOpt.length) outOpt = $outOpt.val()
        let putData = {
            'list_status': list_status,
            'is_edit_date': $('#assignee_edit_date').prop('checked'),
            'is_edit_est': $('#assignee_edit_est').prop('checked'),
            'is_in_assign': $('#in_assign_any').prop('checked'),
            'in_assign_opt': parseInt(inOpt),
            'is_out_assign': $('#out_assign_any').prop('checked'),
            'out_assign_opt': parseInt(outOpt),
        }
        $.fn.callAjax($form.attr('data-url'), 'PUT', putData, true)
            .then(
                (resp) => {
                    const data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.hideLoading();
                        $.fn.notifyPopup({description: data.message}, 'success');
                    }
                }
            )
            .catch((err) => {
                console.log(err)
                $.fn.hideLoading();
            })
    })
}, jQuery);