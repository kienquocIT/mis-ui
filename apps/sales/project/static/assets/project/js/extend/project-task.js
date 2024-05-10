function resetFormTask() {
    // clean html select etc.
    const $taskForm = $('#formOpportunityTask')
    $taskForm.trigger('reset').removeClass('task_edit')
    $('#inputAssigner').val($('#inputAssigner').attr('data-name'))
    $('#employee_inherit_id').val(null).trigger('change').removeClass('is-invalid');
    $('#employee_inherit_id-error').remove()
    $('.label-mark, .wrap-checklist, .wrap-subtask').html('');
    $('#inputLabel').val(null);
    $('#rangeValue').text(0)
    $('#percent_completed').val(0)
    $('[name="id"]', $taskForm).remove();
    $('.create-subtask').addClass('hidden');
    $('[name="parent_n"]', $taskForm).remove();
    window.editor.setData('')
    $('.create-task').attr('disabled', false)
    $('.btn-log_work').removeClass('.disabled')
    $('input[name="work_id"]', $taskForm).remove()
}

function isValidString(inputString) {
    let pattern = /^\d+[wdh]*$/;
    return pattern.test(inputString);
}

class labelHandle {
    deleteLabel(elm) {
        let $taskLabelElm = $('#inputLabel')
        elm.find('.tag-delete').on('click', function (e) {
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
        const _this = this
        let $taskLabelElm = $('#inputLabel')
        $('.form-tags-input-wrap .btn-add-tag').on('click', function () {
            const $elmInputLabel = $('#inputLabelName')
            const newTxt = $elmInputLabel.val()
            let labelList = $taskLabelElm.val()
            if (labelList !== undefined && labelList !== '') labelList = JSON.parse(labelList)
            if (!labelList.length) labelList = []
            labelList.push(newTxt)
            $taskLabelElm.attr('value', JSON.stringify(labelList))
            const labelHTML = $(`<span class="item-tag"><span>${newTxt}</span><span class="tag-delete">x</span></span>`)
            $('.label-mark').append(labelHTML)
            $elmInputLabel.val('')
            _this.deleteLabel(labelHTML)
        })
    }

    showDropdown() {
        $('.label-mark').on('click', function () {
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

function TaskSubmitFunc(platform) {
    let _form = new SetupFormSubmit(platform);
    let formData = _form.dataForm
    const start_date = new Date(formData.start_date).getDate()
    const end_date = new Date(formData.end_date).getDate()
    if (end_date < start_date) {
        $.fn.notifyB({description: $('#form_valid').attr('data-valid-datetime')}, 'failure')
        return false
    }
    if (formData.log_time === "")
        delete formData.log_time
    else {
        let temp = formData.log_time.replaceAll("'", '"')
        temp = JSON.parse(temp)
        formData.log_time = temp
    }
    formData.start_date = moment(formData.start_date, 'DD/MM/YYYY').format('YYYY-MM-DD')
    formData.end_date = moment(formData.end_date, 'DD/MM/YYYY').format('YYYY-MM-DD')
    formData.priority = parseInt(formData.priority)
    let tagsList = $('#inputLabel').attr('value')
    if (tagsList) formData.label = JSON.parse(tagsList)
    formData.employee_created = $('#inputAssigner').attr('value')

    if (!formData.employee_inherit_id) {
        $.fn.notifyB({'description': $('#trans-factory').attr('data-assignee_empty')}, 'failure')
        return false
    }
    formData.checklist = []

    $('.wrap-checklist .checklist_item').each(function () {
        formData.checklist.push({
            'name': $(this).find('label').text(),
            'done': $(this).find('input').prop('checked'),
        })
    })

    if ($('[name="attach"]').val()) {
        let list = []
        list.push($('[name="attach"]').val())
        formData.attach = list
    }

    const prepare_data = {
        project: formData['project_id'],
        work: $('input[name="work_id"]', platform).val(),
        task: formData
    }

    $.fn.callAjax2({
        'url': $('#url-factory').attr('data-task'),
        'method': 'POST',
        'data': prepare_data,
        'sweetAlertOpts': {
            'allowOutsideClick': true
        }
    }).then(
        (resp) => {
            const data = $.fn.switcherResp(resp);
            if (data) {
                $.fn.notifyB({description: data.message}, 'success')
                $('.cancel-task').trigger('click')
            }
        },
        (err) => $.fn.notifyB({description: err.data.errors}, 'failure')
    )
}

class Task_in_project {
    static init(prj_info) {
        let $empElm = $('#employee_inherit_id')
        const $form = $('#formOpportunityTask')

        // hidden update btn
        $('.txt-update').addClass('hidden')

        // init check text estimate
        $('#inputTextEstimate, #EstLogtime').on('blur', function () {
            if (!isValidString(this.value))
                $.fn.notifyB({description: $('#form_valid').attr('data-estimate-error')}, 'failure')
        })

        // click to log-work
        $('.btn-log_work').on('click', function() {
            if ($(this).hasClass('disabled')) return;
            $('#logWorkModal').modal('show')
            $('#startDateLogTime, #endDateLogTime, #EstLogtime').val(null)
            logWorkSubmit()
        })

        // run date picker
        $('.date-picker', $form).each(function(){
            $(this).daterangepicker({
                minYear: 2023,
                singleDatePicker: true,
                timePicker: false,
                showDropdowns: true,
                autoApply: true,
                locale: {
                    format: 'DD/MM/YYYY'
                }
            }).val(null).trigger('change')
        })

        // run status select default
        const sttElm = $('#selectStatus');
        sttElm.attr('data-url')
        $.fn.callAjax2({'url': sttElm.attr('data-url'), 'method': 'get'})
            .then((resp) => {
                const data = $.fn.switcherResp(resp);
                let todoItem = data[sttElm.attr('data-keyResp')][0]
                sttElm.attr('data-onload', JSON.stringify({...todoItem, selected: true}))
                sttElm.initSelect2()
            })

        // run init label function
        let formLabel = new labelHandle()
        formLabel.init()

        // init comment
        $('#btn-open-comment-task').on('click', function () {
            let frmOppTask = $('#formOpportunityTask');
            if (frmOppTask.length > 0) {
                let appIdx = "e66cfb5a-b3ce-4694-a4da-47618f53de4c";  // Application: task - OpportunityTask
                let docIdx = frmOppTask.attr('data-id-loaded');
                if (docIdx) {
                    let modalEle = $('#CommentModal');
                    new $x.cls.cmt(modalEle.find('.comment-group')).init(docIdx, appIdx)
                    modalEle.modal('show');
                } else {
                    $.fn.notifyB({
                        'description': `${$.fn.gettext('Document is not selected')}`,
                    }, 'failure');
                }
            }
        });

        // init ASSIGNER
        const $assignerElm = $('#inputAssigner')
        $assignerElm.val($assignerElm.attr('data-name')).attr('value', $assignerElm.attr('data-value-id'))

        //--DROPDOWN ASSIGN TO-- assign to me btn
        const $assignBtnElm = $(`<a href="#" class="form-text text-muted link-info btn-assign">${$('#form_valid').attr('data-assign-txt')}</a>`)
        $empElm.parents('.form-group').append($assignBtnElm)
        $assignBtnElm.off().on('click', function () {
            if ($(this).hasClass('disabled')) return false
            const infoObj = {
                'full_name': $assignerElm.attr('data-name'),
                'id': $assignerElm.attr('data-value-id'),
                'selected': true
            }

            $empElm.attr('data-onload', JSON.stringify(infoObj))
            if ($(`option[value="${infoObj.id}"]`, $empElm).length <= 0)
                $empElm.append(`<option value="${infoObj.id}">${infoObj.full_name}</option>`)
            $empElm.val(infoObj.id).trigger('change')
        });

        // run component project/employee inherit
        new $x.cls.bastionField({
            has_prj: true,
            has_inherit: true,
            data_inherit: [{
                "id": prj_info?.['employee_inherit']?.['id'],
                "full_name": prj_info?.['employee_inherit']?.['full_name'] || '',
                "first_name": prj_info?.['employee_inherit']?.['first_name'] || '',
                "last_name": prj_info?.['employee_inherit']?.['last_name'] || '',
                "email": prj_info?.['employee_inherit']?.['email'] || '',
                "is_active": prj_info?.['employee_inherit']?.['is_active'] || false,
                "selected": true,
            }],
            data_prj: [{
                "id": prj_info['id'] || '',
                "title": prj_info['title'] || '',
                "code": prj_info['code'] || '',
                "selected": true,
            }]
        }).init();


        // run CKEditor
        ClassicEditor.create(
            $('.ck5-rich-txt').get()[0],
            {toolbar: {items: ['heading', '|', 'bold', 'italic', '|', 'numberedList', 'bulletedList']},},
        ).then(newEditor => {
            // public global scope for clean purpose when reset form.
            let editor = newEditor;
            window.editor = editor;
        })

        // run checklist tab
        let checklist = new checklistHandle()
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
                resetFormTask()
            });
        });

        // init attachment
        new $x.cls.file($('#attachment')).init({'name': 'attach'});

        // validate form
        $form.on('submit', function(e){
            e.preventDefault();
            SetupFormSubmit.validate($form, {
                errorClass: 'is-invalid cl-red',
                submitHandler: TaskSubmitFunc($form)
            })
        });
    }
}