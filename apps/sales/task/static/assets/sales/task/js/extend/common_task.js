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
        // Prevent double-click                                                                                                                                                       │ │
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