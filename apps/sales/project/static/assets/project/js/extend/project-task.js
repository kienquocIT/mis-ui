function resetFormTask() {
    // clean html select etc.
    const $taskForm = $('#formOpportunityTask')
    $taskForm.trigger('reset').removeClass('task_edit')
    $('#inputAssigner').val($('#inputAssigner').attr('data-name'))
    $('#employee_inherit_id').val(null).trigger('change').removeClass('is-invalid');
    $('.label-mark, .wrap-checklist, .wrap-subtask').html('');
    $('#inputLabel').val(null);
    $('#rangeValue').text(0)
    $('#percent_completed').val(0)
    $('[name="id"], input[name="work_id"], [name="parent_n"], #employee_inherit_id-error', $taskForm).remove();
    $('.create-subtask').addClass('hidden');
    window.editor.setData('')
    $('.create-task').attr('disabled', false)
    $('.btn-log_work').removeClass('.disabled')
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

    formData.work = $('input[name="work_id"]', platform).val()
    formData.project = formData.project_id
    let method = 'POST', url = platform.attr('data-url')
    if ($('input[name="id"]', platform).length)
        if ($('input[name="id"]', platform).val().length) {
            method = 'PUT'
            url = $('#assign_task-url').attr('data-task_detail').format_url_with_uuid($('input[name="id"]', platform).val())
        }

    $.fn.callAjax2({
        'url': url,
        'method': method,
        'data': formData,
        'sweetAlertOpts': {
            'allowOutsideClick': true
        },
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
            let url = $('#url-factory').attr('data-task-logtime')
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

class Task_in_project {
    static initTableLogWork(dataList) {
        let $table = $('#table_log-work')
        if ($table.hasClass('dataTable')) {
            $table.DataTable().clear().draw();
            $table.DataTable().rows.add(dataList).draw();
        } else $table.DataTable({
            searching: false,
            ordering: false,
            paginate: false,
            info: false,
            data: dataList,
            columns: [
                {
                    data: 'employee_created',
                    targets: 0,
                    width: "35%",
                    render: (data, type, row) => {
                        let avatar = ''
                        const full_name = data.last_name + ' ' + data.first_name
                        if (data?.['avatar'])
                            avatar = `<img src="${data?.['avatar']}" alt="user" class="avatar-img">`
                        else avatar = $.fn.shortName(full_name, '', 5)
                        return `<div class="avatar avatar-rounded avatar-xs avatar-${$x.fn.randomColor()}">
                                        <span class="initial-wrap">${avatar}</span>
                                    </div>
                                    <span class="ml-2">${full_name}</span>`;
                    }
                },
                {
                    data: 'start_date',
                    targets: 1,
                    width: "35%",
                    render: (row, type, data) => {
                        let date = moment(row, 'YYYY-MM-DDThh:mm:ss').format('YYYY/MM/DD')
                        date += ' ~ '
                        date += moment(data.end_date, 'YYYY-MM-DDThh:mm:ss').format('YYYY/MM/DD')

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

    static renderSubtask(taskID, dataSub) {
        const $wrap = $('.wrap-subtask'), $btnSub = $('.create-subtask')
        let subTaskList = dataSub
        $wrap.html('')
        if (subTaskList.length)
            for (let [key, item] of subTaskList.entries()) {
                const template = $(`<div class="d-flex justify-content-start align-items-center subtask_item">
                                    <p class="sub-tit" title="${item.title}">${item.title}</p>
                                    <p class="sub-employee" title="${item.employee_inherit}"><span class="chip chip-primary chip-pill"><span class="chip-text">${item.employee_inherit}</span></span></p>
                                    <button class="btn btn-flush-primary btn-icon btn-rounded ml-auto flush-soft-hover disabled">
                                        <span><i class="fa-regular fa-trash-can fa-sm"></i></span>
                                    </button>
                                 </div>`);
                $wrap.append(template);
            }

        $btnSub.on('click', function(){
            resetFormTask()
            $('.title-create').removeClass("hidden")
            $('.title-detail').addClass("hidden")
            // $('.btn-assign').removeClass('disabled')
            // after reset
            $('#formOpportunityTask').append(`<input type="hidden" name="parent_n" value="${taskID}"/>`)
            const employee = JSON.parse($('#employee_info').text())
            $('#inputAssigner').val(employee.full_name).attr({
                "value": employee.id,
                "data-name": employee.full_name,
                "data-value-id": employee.id,
            })
            $btnSub.addClass('hidden')
        });
    }

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
        window.formLabel = formLabel

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
                "id": prj_info['employee_inherit']['id'],
                "full_name": prj_info['employee_inherit']['full_name'],
                "first_name":  '',
                "last_name": '',
                "email": '',
                "is_active": true,
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

        // init more employee
        Task_in_project.initExpenseLabor()
    }

    static loadTask(task_info) {
        window.is_load = true
        const $form = $('#formOpportunityTask');
        $('.title-create').addClass('hidden')
        $('.title-detail').removeClass('hidden')
        if (task_info.work_id)
            $form.append(`<input type="hidden" name="work_id" value="${task_info.work_id}"/>`)
        $.fn.callAjax2({
            'url': $('#assign_task-url').attr('data-task_detail').format_url_with_uuid(task_info.task),
            'method': 'GET',
            'sweetAlertOpts': { 'allowOutsideClick': true }
        }).then(
            (resp) => {
                const data = $.fn.switcherResp(resp);
                if (data) {
                    $('#inputTextTitle', $form).val(data.title)
                    $('#inputTextCode', $form).val(data.code)
                    const taskIDElm = $(`<input type="hidden" name="id" value="${data.id}"/>`)
                    $form.append(taskIDElm)
                    $('#inputTextStartDate', $form).val(
                        moment(data.start_date, 'YYYY-MM-DD hh:mm:ss').format('DD/MM/YYYY')
                    )
                    $('#inputTextEndDate', $form).val(
                        moment(data.end_date, 'YYYY-MM-DD hh:mm:ss').format('DD/MM/YYYY')
                    )
                    $('#inputTextEstimate', $form).val(data.estimate)
                    $('#selectPriority', $form).val(data.priority).trigger('change')
                    $('#rangeValue').text(data['percent_completed'])
                    $('#percent_completed').val(data['percent_completed'])

                    $('#inputAssigner', $form).val(data.employee_created.full_name)
                        .attr('data-value-id', data.employee_created.id)
                        .attr('value', data.employee_created.id)
                    const $EmpElm = $('#employee_inherit_id', $form)
                    if ($EmpElm.find(`option[value="${data.employee_inherit.id}"]`).length > 0)
                        $EmpElm.val(data.employee_inherit.id).trigger('change')
                    else $EmpElm.append(`<option value="${data.employee_inherit.id}" selected>${
                        data.employee_inherit.full_name}</option>`).trigger('change')

                    window.formLabel.renderLabel(data.label)
                    window.editor.setData(data.remark)
                    window.checklist.setDataList = data.checklist
                    window.checklist.render()

                    if (data.attach) {
                        const fileDetail = data.attach[0]?.['files']
                        FileUtils.init($(`[name="attach"]`).siblings('button'), fileDetail);
                    }
                    Task_in_project.initTableLogWork(data?.['task_log_work'])
                    Task_in_project.renderSubtask(data.id, data?.['sub_task_list'])

                    // show hide btn sub-task
                    const $btnSub = $('.create-subtask')
                    if (Object.keys(data.parent_n).length > 0) $btnSub.addClass('hidden')
                    else $btnSub.removeClass('hidden')
                    window.is_load = false
                }
            },
            (err) => $.fn.notifyB({description: err.data.errors}, 'failure')
        )
    }

    static linkUnlinkTask(info){
        window.task_done = true
        let data = {'work': info.work_id}
        if (info.unlink) data = {'unlink': true}
        $.fn.callAjax2({
            'url': $('#assign_task-url').attr('data-task_link').format_url_with_uuid(info.id),
            'method': 'PUT',
            'data': data,
            'sweetAlertOpts': { 'allowOutsideClick': true }
        }).then(
            (resp) => {
                const data = $.fn.switcherResp(resp);
                if (data && (data['status'] === 201 || data['status'] === 200)) {
                    $.fn.notifyB({description: data.message}, 'success');
                }
                window.task_done = false
            },
            (err) => $.fn.notifyB({description: err.data.errors}, 'failure')
        )
    }

    static deleteTask(task){
        $.fn.callAjax2({
            'url': $('#assign_task-url').attr('data-task_detail').format_url_with_uuid(task),
            'method': 'DELETE',
            'sweetAlertOpts': { 'allowOutsideClick': true }
        }).then(
            (resp) => {
                const data = $.fn.switcherResp(resp);
                if (data) $.fn.notifyB({description: data.message}, 'success');
            },
            (err) => $.fn.notifyB({description: err.data.errors}, 'failure')
        )
    }

    static initExpenseLabor(){
        const $taskID = $('#formOpportunityTask');
        const $parent = $('#select_expense'), $child = $('#select_expense_role'),
            $grandChild = $('#select_expense_role_employee');
        $parent.initSelect2({width: 'resolve'}).on('select2:select', function(e){
            const _value = e.params.data.data, _role_lst = _value.role
            if ($child.hasClass("select2-hidden-accessible")) $child.select2('destroy').html('')
            for (let item of _role_lst){
                $child.append(new Option(item.title, item.id, false, false))
            }
            $child.initSelect2({allowClear: true}).on('select2:select', function(){
                let params = $grandChild.attr('data-params').replaceAll("'", '"')
                params = JSON.parse(params)
                params.role = $child.val().join(',')
                if ($grandChild.hasClass("select2-hidden-accessible")) $grandChild.select2('destroy').html('')
                $grandChild.attr('data-params', JSON.stringify(params)).initSelect2({width: 'resolve'})
            })
        });

        // append button toggle check employee in expense role
        $taskID.find('.custom-layout').prev().after(`<div class="col-md-12 col-xs-12">`
            + `<a href="#" class="text-bold d-block btn-check_emp text-decoration-underline mb-3">${
            $.fn.gettext('Check employee availability are filter by the role in expense')}</a></div>`)

        $('.btn-check_emp').on('click', function(){
            $('#check_expense_modal').toggleClass('hidden')
        })
        dragElement($('#check_expense_modal')[0])
    }
}

$(document).on('Task.click.view', function(e, detail){
    if (!window.is_load){
        if ($('#drawer_task_create').hasClass('open')) resetFormTask()
        else $('.btn-show-task_f').trigger('click');
        Task_in_project.loadTask(detail)
    }
});

$(document).on('Task.link.work', function(e, detail){
    if (window.task_done === false) Task_in_project.linkUnlinkTask(detail)
});
