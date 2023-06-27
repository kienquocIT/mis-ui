$(function(){
    //declare global variable
    const $form = $('#formOpportunityTaskConfig')
    const $todoElm = $('#todo_list')

    // get config detail
    $.fn.showLoading();
    $.fn.callAjax($form.attr('data-url'),'GET',).then(
        (resp) => {
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
                    elm.find('.status_translate_name').html(item.translate_name)
                    $todoElm.append(elm)
                }

                for (let item of itemEdit){
                    const positionCompleted = $('#todo_list li').length - 2
                    let elm = $($('#item_config').html())
                    elm.attr('data-id', item.id)
                    elm.find('.status_name').html(item.name)
                    elm.find('.status_translate_name').html(item.translate_name)
                    elm.insertBefore($('li', $todoElm).eq(positionCompleted))
                    $('.icon-close i', elm).off().on('click', function () {
                        $(this).closest('li').remove()
                    })
                }
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
        $.fn.showLoading();
        e.preventDefault();
        const csr = $("[name=csrfmiddlewaretoken]").val();
        let list_status = []
        let order = 1
        $('li:not(.ui-state-system)', $todoElm).each(function(){
            const $this = $(this)
            list_status.push({
                'id': $this.attr('data-id') ? $this.attr('data-id') : '',
                'name': $('.status_name', $this).text(),
                'translate_name': $('.status_translate_name', $this).text(),
                'order': order
            })
            order++
        })
        let putData = {'list_status' : list_status}
        $.fn.callAjax($form.attr('data-url'), 'PUT', putData, csr)
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