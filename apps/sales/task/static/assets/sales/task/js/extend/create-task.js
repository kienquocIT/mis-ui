function resetFormTask() {
    // clean html select etc.
    $('#formOpportunityTask').trigger('reset').removeClass('task_edit')
    $('#selectAssignTo').val(null).trigger('change').prop('disabled', false);
    if ($('.current-create-task').length <= 0)
        $('#selectOpportunity').val(null).trigger('change').attr('disabled', false);
    $('.label-mark, .wrap-checklist, .wrap-subtask').html('');
    $('#inputLabel').val(null);
    $('[name="id"]').remove();
    const $inputAssigner = $('#inputAssigner');
    $inputAssigner.val($inputAssigner.attr('data-name'))
    $('.create-subtask').addClass('hidden')
    $('[name="parent_n"]').remove();
    window.editor.setData('')
    $('.create-task').attr('disabled', false)
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

class AssignToSetup {
    static case01(config, params) {
        // có opps + config có in assign opt lớn hơn 0
        const urlOpptDetail = $('#task_url_sub').attr('data-opps-detail').format_url_with_uuid(
            $('#selectOpportunity').val())
        const $AseElm = $('#selectAssignTo')
        const userSelect = JSON.parse($AseElm.attr('data-onload')) || {}
        if (config.in_assign_opt === 1) {
            // chỉ employee trong opportunity
            $('.is-lazy-loading').addClass('is_show')
            $.fn.callAjax2({
                    'url': urlOpptDetail,
                    'method': 'get',
                })
                .then((resp) => {
                        const data = $.fn.switcherResp(resp);
                        let selectOpt = [
                            {
                                "id": "",
                                "full_name": "",
                                "selected": true
                            }
                        ]
                        let checkDup = false
                        for (const item of data.opportunity.opportunity_sale_team_datas){
                            let temp = false
                            if (userSelect.hasOwnProperty('id') && userSelect.id === item?.member.id){
                                temp = true
                                selectOpt[0].selected = false
                            }
                            selectOpt.push({
                                'id': item.member.id,
                                "full_name": item?.member.name,
                                "selected": temp
                            })
                            if (item.member.id === data.opportunity.sale_person.id) checkDup = true
                        }
                        // add user inherit in list user assign
                        if (!checkDup){
                            let temp = false
                            if (userSelect.hasOwnProperty('id') && userSelect.id === data.opportunity.sale_person.id){
                                temp = true
                                selectOpt[0].selected = false
                            }
                            selectOpt.push({
                                "id": data.opportunity.sale_person.id,
                                "full_name": data.opportunity.sale_person.full_name,
                                "selected": temp
                            })
                        }
                        if ($AseElm.hasClass("select2-hidden-accessible")) $AseElm.html('').select2('destroy')
                        $AseElm.removeAttr('data-url')
                        $('.is-lazy-loading').removeClass('is_show')
                        $AseElm.initSelect2({
                            data: selectOpt
                        })
                    })

        } else if (config.in_assign_opt === 2) {
            // chỉ nhân viên của user
            params = {'group__first_manager__id': true}
            $AseElm.attr('data-params', JSON.stringify(params)).initSelect2()
        } else {
            // vừa trong opportunity vừa là nhân viên của user
            $('.is-lazy-loading').addClass('is_show')
            let ListMemberInOppt = $.fn.callAjax2({'url': urlOpptDetail, 'method': 'get'})
            let ListStaff = $.fn.callAjax2({
                'url': $AseElm.attr('data-url'), 'method': 'get',
                'data': {'group__first_manager__id': true}
            })
            $.when(ListMemberInOppt, ListStaff).done(function (res01, res02) {
                const data01 = $.fn.switcherResp(res01);
                const data02 = $.fn.switcherResp(res02);

                let opts = [
                    {
                        "id": "",
                        "full_name": "",
                        "selected": !userSelect.hasOwnProperty('id')
                    }
                ]
                let defaultList = []
                // data01 là ds use trong phòng
                if (data01.status === 200) {
                    for (const item of data01.opportunity.opportunity_sale_team_datas) {
                        let temp = false
                        if (userSelect.hasOwnProperty('id') && userSelect.id === item?.member?.id) temp = true
                        opts.push({'id': item?.member?.id, "full_name": item?.member?.name, "selected": temp})
                        defaultList[item?.member?.id] = true
                    }
                }
                // data02 là ds user trong team của opp
                if (data02.status === 200)
                    for (const item of data02[$AseElm.attr('data-keyresp')]){
                        const itemID = item?.[$AseElm.attr('data-keyid')]
                        if (!defaultList?.[itemID]){
                            let temp = false
                            if (userSelect.hasOwnProperty('id') && userSelect.id === itemID) temp = true
                            opts.push({
                                'id': itemID,
                                'full_name': item?.[$AseElm.attr('data-keytext')],
                                'selected': temp
                            })
                        }
                    }
                if ($AseElm.hasClass("select2-hidden-accessible")) $AseElm.select2('destroy')
                $AseElm.removeAttr('data-url')
                $('.is-lazy-loading').removeClass('is_show')
                $AseElm.initSelect2({
                    data: opts
                })
            })
        }
        return params
    }

    static case02(config, params) {
        // ko có opps + config có out assign opt lớn hơn 0
        if (config.out_assign_opt === 1)
            // giao cho user trong phòng ban chính user đó
            params = {'group__id': true}
        else
            // chỉ nhân viên của user
            params = {'group__first_manager__id': true}
        return params
    }

    static hasConfig(config) {
        const $selectElm = $('#selectAssignTo')
        let params = {}
        const oppsElm = $('#selectOpportunity').val()
        if (oppsElm && config.in_assign_opt > 0) this.case01(config, params)
        else if (config.out_assign_opt > 0){
            params = this.case02(config, params)
            $selectElm.attr('data-params', JSON.stringify(params))
            if ($selectElm.hasClass("select2-hidden-accessible")) $selectElm.select2('destroy')
            $selectElm.initSelect2()
        }

    }

    static init() {
        const $self = this
        const taskConfig = $('#task_config')
        const isConfig = JSON.parse(taskConfig.text())
        this.hasConfig(isConfig)

        const $OppsElm = $('#selectOpportunity')
        $OppsElm.on("select2:select", function () {
            // const item = e.params.data
            $self.hasConfig(isConfig)
        })
    }
}

class labelHandle {
    deleteLabel(elm) {
        const $taskLabelElm = $('#inputLabel')
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

    //--DATETIME-- run single date
    $('input[type=text].date-picker').daterangepicker({
        minYear: 2023,
        singleDatePicker: true,
        timePicker: false,
        showDropdowns: true,
        // "cancelClass": "btn-secondary",
        // maxYear: parseInt(moment().format('YYYY'), 10)
        locale: {
            format: 'DD/MM/YYYY'
        }
    })

    //--DROPDOWN STATUS-- run status select default
    const sttElm = $('#selectStatus');
    sttElm.attr('data-url')
    $.fn.callAjax2({
        'url': sttElm.attr('data-url'),
        'method': 'GET'
    })
        .then(
            (resp) => {
                const data = $.fn.switcherResp(resp);
                let todoItem = data[sttElm.attr('data-keyResp')][0]
                $('.btn-create-todo, .current-create-task').click(() => {
                    sttElm.attr('data-onload', JSON.stringify(todoItem))
                    sttElm.initSelect2()
                })
            })

    // load assigner
    const $assignerElm = $('#inputAssigner')
    $assignerElm.val($assignerElm.attr('data-name')).attr('value', $assignerElm.attr('data-value-id'))

    //--DROPDOWN ASSIGN TO-- assign to me btn
    const $assignBtnElm = $('.btn-assign');
    const $assigneeElm = $('#selectAssignTo')
    AssignToSetup.init()
    $assignBtnElm.off().on('click', function () {
        if ($(this).hasClass('disabled')) return false
        const employee = JSON.parse($('#employee_info').text())
        const infoObj = {
            "full_name": employee.full_name,
            "id": employee.id
        }
        $assigneeElm.attr('data-onload', JSON.stringify(infoObj))
        if ($(`option[value="${employee.id}"]`, $assigneeElm).length <= 0)
            $assigneeElm.append(`<option value="${employee.id}">${employee.full_name}</option>`)
        $assigneeElm.val(employee.id).trigger('change')
    });

    //--INPUT LABEL-- run init label function
    let formLabel = new labelHandle()
    formLabel.init()
    // public global scope for list page render when edit
    window.formLabel = formLabel

    //--DROPDOWN OPPORTUNITY-- autoload opp if in page opp
    const $btnInOpp = $('.current-create-task')
    const $selectElm = $('#selectOpportunity')
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
                $selectElm.attr('data-onload', JSON.stringify(data)).attr('disabled', true)
                $selectElm.initSelect2()
            }
        }, 1000)
    } else {
        // run init select2 in task page
        $selectElm.initSelect2()
    }

    //--BTN LOG-TIME-- action click to log-work
    $('.btn-log_work').off().on('click', () => {
        $('#logWorkModal').modal('show')
        $('#startDateLogTime, #endDateLogTime, #EstLogtime').val(null)
        const taskID = $('.task_edit [name="id"]').val()
        if (taskID) $('#logtime_task_id').val(taskID)
        logworkSubmit()
    })

    // run CKEditor
    ClassicEditor
        .create(document.querySelector('.ck5-rich-txt'),
            {
                toolbar: {
                    items: ['heading', '|', 'bold', 'italic', 'strikethrough', 'underline',
                        '|', 'numberedList', 'bulletedList']
                },
            },
        )
        .then(newEditor => {
            // public global scope for clean purpose when reset form
            window.editor = newEditor;
        })

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
            resetFormTask()
        });
    });

    // validate form
    SetupFormSubmit.validate(
        $form, {
            submitHandler: function () {
                let _form = new SetupFormSubmit($form);
                let formData = _form.dataForm
                const start_date = new Date(formData.start_date).getDate()
                const end_date = new Date(formData.end_date).getDate()
                const $assignerElm = $('#inputAssigner')

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
                if (tagsList)
                    formData.label = JSON.parse(tagsList)
                formData.employee_created = $assignerElm.attr('value')
                formData.task_status = $('#selectStatus').val()
                const task_status = $('#selectStatus').select2('data')[0]
                const taskSttData = {
                    'id': task_status.id,
                    'title': task_status.text,
                }

                const assign_to = $('#selectAssignTo').select2('data')[0]
                let assign_toData = {}
                if (assign_to){
                    assign_toData = {
                        'id': assign_to.id,
                        'full_name': assign_to.text,
                    }
                    formData.employee_inherit_id = assign_to.id
                }

                formData.checklist = []
                $('.wrap-checklist .checklist_item').each(function () {
                    formData.checklist.push({
                        'name': $(this).find('label').text(),
                        'done': $(this).find('input').prop('checked'),
                    })
                })

                if (!formData.opportunity) delete formData.opportunity
                if ($('#selectOpportunity').val()) formData.opportunity = $('#selectOpportunity').val()

                if ($('[name="attach"]').val()) {
                    let list = []
                    list.push($('[name="attach"]').val())
                    formData.attach = list
                }

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
                                $('body').append(elm)
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