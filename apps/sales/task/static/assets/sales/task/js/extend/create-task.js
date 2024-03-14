function resetFormTask() {
    // clean html select etc.
    $('#formOpportunityTask').trigger('reset').removeClass('task_edit')
    $('#employee_inherit_id').val('').trigger('change').prop('disabled', false).removeClass('is-invalid');
    $('#employee_inherit_id-error').remove()
    $('#opportunity_id').val('').trigger('change').attr('disabled', false);
    $('.label-mark, .wrap-checklist, .wrap-subtask').html('');
    $('#inputLabel').val(null);
    $('#rangeValue').text(0)
    $('#percent_completed').val(0)
    $('[name="id"]').remove();
    const $inputAssigner = $('#inputAssigner');
    $inputAssigner.val($inputAssigner.attr('data-name'))
    $('.create-subtask').addClass('hidden')
    $('[name="parent_n"]').remove();
    window.editor.setData('')
    $('.create-task').attr('disabled', false)
}

function isValidString(inputString) {
    let pattern = /^\d+[wdh]*$/;
    return pattern.test(inputString);
}

function logworkSubmit() {
    $('#save-logtime').off().on('click', function () {
        const startDate = $('#startDateLogTime').val()
        const endDate = $('#endDateLogTime').val()
        const est = $('#EstLogtime').val()
        const taskID = $('#logtime_task_id').val()
        if (!startDate && !endDate && !est) {
            $.fn.notifyB({description: $('#form_valid').attr('data-logtime-valid')}, 'failure')
            return false
        }
        const data = {
            'start_date': moment(startDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
            'end_date': moment(endDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
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

$(function () {
    // declare variable
    const $form = $('#formOpportunityTask')
    const $empElm = $('#employee_inherit_id')
    const $sttElm = $('#selectStatus');
    const $oppElm = $('#opportunity_id')

    new $x.cls.file($('#attachment')).init({'name': 'attach'});

    //--DATETIME-- run single date
    $('input[type=text].date-picker').daterangepicker({
        minYear: 2023,
        singleDatePicker: true,
        timePicker: false,
        showDropdowns: true,
        locale: {
            format: 'DD/MM/YYYY'
        }
    })

    //--DROPDOWN STATUS-- run status select default
    $sttElm.attr('data-url')
    $.fn.callAjax2({
        'url': $sttElm.attr('data-url'),
        'method': 'GET'
    })
        .then(
            (resp) => {
                const data = $.fn.switcherResp(resp);
                let todoItem = data[$sttElm.attr('data-keyResp')][0]
                $('.btn-create-todo, .current-create-task').click(() => {
                    $sttElm.attr('data-onload', JSON.stringify(todoItem))
                    $sttElm.initSelect2()
                })
            })

    // load assigner
    const $assignerElm = $('#inputAssigner')
    $assignerElm.val($assignerElm.attr('data-name')).attr('value', $assignerElm.attr('data-value-id'))

    //--DROPDOWN ASSIGN TO-- assign to me btn
    const $assignBtnElm = $(`<a href="#" class="form-text text-muted link-info btn-assign">${$('#form_valid').attr('data-assign-txt')}</a>`)
    $empElm.parents('.form-group').append($assignBtnElm)
    $assignBtnElm.off().on('click', function () {
        if ($(this).hasClass('disabled')) return false
        const employee = JSON.parse($('#employee_info').text())
        const infoObj = {
            'full_name': employee.full_name,
            'id': employee.id,
            'selected': true
        }
        $empElm.attr('data-onload', JSON.stringify(infoObj))
        if ($(`option[value="${employee.id}"]`, $empElm).length <= 0)
            $empElm.append(`<option value="${employee.id}">${employee.full_name}</option>`)
        $empElm.val(employee.id).trigger('change')
    });

    $('#inputTextEstimate').on('blur', function(){
        if (!isValidString(this.value))
            $.fn.notifyB({description: $('#form_valid').attr('data-estimate-error')}, 'failure')
    })


    //--INPUT LABEL-- run init label function
    let formLabel = new labelHandle()
    formLabel.init()
    // public global scope for list page render when edit
    window.formLabel = formLabel

    //--DROPDOWN OPPORTUNITY-- autoload opp if in page opp
    const $btnInOpp = $('.current-create-task')
    if ($btnInOpp.length) {
        const pk = $.fn.getPkDetail()
        let data = {
            "id": pk,
            "title": ''
        }
        const isCheck = setInterval(() => {
            let oppCode = $('#span-code').text()
            if (oppCode.length) {
                clearInterval(isCheck)
                data.title = oppCode
                $oppElm.attr('data-onload', JSON.stringify(data)).attr('disabled', true)
                $oppElm.initSelect2()
            }
        }, 1000)
    } else $oppElm.initSelect2() // run init select2 in task page

    //--BTN LOG-TIME-- action click to log-work
    $('.btn-log_work').off().on('click', () => {
        $('#logWorkModal').modal('show')
        $('#startDateLogTime, #endDateLogTime, #EstLogtime').val(null)
        const taskID = $('.task_edit [name="id"]').val()
        if (taskID) $('#logtime_task_id').val(taskID)
        logworkSubmit()
    })

    // run CKEditor
    ClassicEditor.create(document.querySelector('.ck5-rich-txt'),
            {
                toolbar: {
                    items: ['heading', '|', 'bold', 'italic', 'strikethrough', 'underline',
                        '|', 'numberedList', 'bulletedList']
                },
            },
        )
        .then(newEditor => window.editor = newEditor) // public global scope for clean purpose when reset form)

    // run checklist tab
    let checklist = new checklistHandle();
    checklist.init();
    // public global scope with name checklist
    window.checklist = checklist;

    // reset form create task khi click huỷ bỏ hoặc tạo mới task con
    $('.cancel-task, [data-drawer-target="#drawer_task_create"]').each((idx, elm) => {
        $(elm).on('click', function () {
            if ($(this).hasClass('cancel-task')) {
                $(this).closest('.ntt-drawer').toggleClass('open');
                $('.hk-wrapper').toggleClass('open');
            }
            const titCreate = $('.title-create'), titEdit = $('.title-detail');
            if (titCreate.hasClass('hidden')) titCreate.removeClass("hidden")
            if (!titEdit.hasClass('hidden')) titEdit.addClass("hidden")
            resetFormTask()
        });
    });

    // validate form
    SetupFormSubmit.validate(
        $form, {
            submitHandler: function () {
                let _form = new SetupFormSubmit($form);
                let formData = _form.dataForm
                const $assignerElm = $('#inputAssigner')

                if (formData.log_time === "") delete formData.log_time
                else {
                    let temp = formData.log_time.replaceAll("'", '"')
                    temp = JSON.parse(temp)
                    formData.log_time = temp
                }
                formData.start_date = $x.fn.convertDatetime(formData.start_date, 'DD/MM/YYYY', null)
                formData.end_date = $x.fn.convertDatetime(formData.end_date, 'DD/MM/YYYY', null)
                if (new Date(formData.end_date).getTime() < new Date(formData.start_date).getTime()) {
                    $.fn.notifyB({description: $('#form_valid').attr('data-valid-datetime')}, 'failure')
                    return false
                }

                formData.priority = parseInt(formData.priority)
                let tagsList = $('#inputLabel').attr('value')
                if (tagsList)
                    formData.label = JSON.parse(tagsList)
                formData.employee_created = $assignerElm.attr('value')
                // formData.task_status = $sttElm.val()
                const task_status = $sttElm.select2('data')[0]
                const taskSttData = {
                    'id': task_status.id,
                    'title': task_status.text,
                }

                if (!isValidString(formData.estimate)){
                    $.fn.notifyB({description: $('#form_valid').attr('data-estimate-error')}, 'failure')
                    return false
                }

                const assign_to = $empElm.select2('data')[0]
                let assign_toData = {}
                if (assign_to){
                    assign_toData = {
                        'id': assign_to.id,
                        'full_name': assign_to.text,
                        'first_name': assign_to.first_name,
                        'last_name': assign_to.last_name,
                    }
                    // formData.employee_inherit_id = assign_to.id
                }

                formData.checklist = []
                $('.wrap-checklist .checklist_item').each(function () {
                    formData.checklist.push({
                        'name': $(this).find('label').text(),
                        'done': $(this).find('input').prop('checked'),
                    })
                })

                if (!formData.opportunity) delete formData.opportunity
                if ($oppElm.val()){
                    formData.opportunity = $oppElm.val()
                    formData.opportunity_id = $oppElm.val()
                }

                const $attElm = $('[name="attach"]').val()
                if ($attElm) formData.attach = [...$attElm]

                let method = 'POST'
                let url = _form.dataUrl
                if (formData.id && formData.id !== '') {
                    method = 'PUT'
                    url = $('#url-factory').attr('data-task-detail').format_url_with_uuid(formData.id)
                }
                $.fn.callAjax2({
                    'url': url,
                    'method': method,
                    'data': formData
                }).then(
                    (resp) => {
                        const data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: data?.message || data?.detail}, 'success')
                            // if in task page load add task function
                            if ($(document).find('#tasklist_wrap').length) {
                                let elm = $('<input type="hidden" id="addNewTaskData"/>');
                                // case update
                                if (!data?.id && data?.status === 200) {
                                    elm = $('<input type="hidden" id="updateTaskData"/>');
                                    formData.code = $('#inputTextCode').val();
                                    formData.assign_to = assign_toData
                                    formData.task_status = taskSttData
                                    formData.employee_created = {
                                        "id": $assignerElm.attr('value'),
                                        "full_name": $assignerElm.attr('data-name'),
                                        "first_name": $assignerElm.attr('data-name').split('. ')[1],
                                        "last_name": $assignerElm.attr('data-name').split('. ')[0],
                                    }
                                }
                                // case create
                                if (data?.id) formData = data
                                const datadump = JSON.stringify(formData)
                                elm.removeAttr('data-task').attr('data-task', datadump)
                                $('body').append(elm).trigger('From-Task.Submitted')

                            }
                            if ($('.current-create-task').length) $('.cancel-task').trigger('click')
                        }
                    },
                    (errs) => {
                    if (errs?.data?.errors)
                        $.fn.notifyB({'description': errs?.data?.errors}, 'failure')
                    }

                )
            }
        })
}, jQuery)