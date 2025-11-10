function resetFormTask() {
    // clean html select etc.
    const $form = $('#formOpportunityTask')
    $form[0].reset()
    $form.removeClass('task_edit')
    $('#employee_inherit_id-error, [name="id"], [name="parent_n"]').remove()
    if ($('#employee_inherit_id')[0].closest('#formOpportunityTask')) {
        $('#employee_inherit_id, #opportunity_id, #project_id').val(null)
        .trigger('change', BastionFieldControl.skipBastionChange)
        .prop('disabled', false)
        .removeClass('is-invalid');
    }

    $('.label-mark, .wrap-checklist, .wrap-subtask').html('');
    $('#inputLabel').val(null);
    $('#rangeValue').text(0)
    $('#percent_completed').val(0)
    const $inputAssigner = $('#inputAssigner');
    $inputAssigner.val($inputAssigner.attr('data-name'))
    $('.create-subtask, .parents-block').addClass('hidden')
    window.editor.setData('')
    $('.create-task').attr('disabled', false);
    $('#formOpportunityTask + .task_loading').hide()
    $('#process_id').val(null).trigger('change')
    $('#selectStatus').val(function(){
        let data = $(this).data('default-stt')
        if (!$(this).find(`option[value="${data.id}"]`).length)
            $(this).append(`<option value="${data.id} selected>${data.title}</option>`)
        return data.id
    }).trigger('change')

    const resetUploader = ($element) => {
        $element.find('.dm-uploader').dmUploader("reset");
        $element.find('.dm-uploader-result-list').html('');
        $element.find('.dm-uploader-no-files').css({'display': 'block'});
    };
    resetUploader($('#assigner_attachment'));
    resetUploader($('#assignee_attachment'));

    const $table = $('#table_log-work')
    if ($table.hasClass('dataTable')) $table.DataTable().clear().draw();
}

function isValidString(inputString) {
    // Kiểm tra null/undefined/empty
    if (!inputString || typeof inputString !== 'string') {
        return false;
    }

    // Trim và lowercase để xử lý khoảng trắng và chữ hoa
    const cleanInput = inputString.trim().toLowerCase();

    // Pattern cải tiến:
    // - Số nguyên dương: 5, 10 (không chấp nhận 0)
    // - Số + d: 5d (ngày)
    // - Số + h: 8h (giờ)
    // - Số + d + số + h: 5d8h (5 ngày 8 giờ)
    // - Số + d + 0.5h: 5d0.5h (5 ngày rưỡi)
    // - Đặc biệt 0.5h (30 phút)
    const pattern = /^(([1-9]\d*)d([1-9]\d*|0\.5)h|([1-9]\d*)d|([1-9]\d*|0\.5)h|[1-9]\d*)$/;

    if (!pattern.test(cleanInput)) {
        return false;
    }

    // Validation bổ sung: giới hạn số ngày hợp lý (tối đa 365 ngày)
    const dayMatch = cleanInput.match(/(\d+)d/);
    return !(dayMatch && parseInt(dayMatch[1]) > 365);
}

$(document).ready(function () {
    // declare variable
    const $form = $('#formOpportunityTask')
    const $empElm = $('#employee_inherit_id')
    const $sttElm = $('#selectStatus');
    const $oppElm = $('#opportunity_id')
    const $prjElm = $('#project_id')
    const $btnCanvasLoad = $('#formOpportunityTask + .task_loading')
    const oCanvas = $('#offCanvasRightTask')
    const $btnCreateTodo = $('.btn-create-todo')

    let $customAssignee = $('#custom_assignee');

    new $x.cls.file($('#assigner_attachment')).init({'name': 'attach'});
    new $x.cls.file($('#assignee_attachment')).init({'name': 'attach_assignee'});

    //--DATETIME-- run single date
    $('input[type=text].date-picker').flatpickr({
        'allowInput': true,
        'altInput': true,
        'altFormat': 'd/m/Y',
        'defaultDate': null,
        'locale': globeLanguage === 'vi' ? 'vn' : 'default',
        'shorthandCurrentMonth': true,
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
                let todoItem = data[$sttElm.attr('data-keyResp')][0];

                let drawerEle = new Set([]);
                $('.btn-create-todo, .current-create-task').each(function(){
                    const idx = $(this).attr('data-drawer-target');
                    if (idx) drawerEle.add(idx);
                });

                $(Array.from(drawerEle).join(", ")).on('drawer.show', function (){
                    const loaded = $(this).attr('data-loaded') === '1';
                    if (!loaded){
                        $(this).attr('data-loaded', '1');
                        $sttElm.attr('data-onload', JSON.stringify(todoItem));
                        $sttElm.initSelect2();
                    }
                });

                const create_open = $x.fn.getUrlParameter('create_open', '') === 'true';
                if (create_open === true) {
                    $("#drawer_task_create").trigger('drawer.show');
                }
            })

    // load assigner
    const $assignerElm = $('#inputAssigner')
    $assignerElm.val($assignerElm.attr('data-name')).attr('value', $assignerElm.attr('data-value-id'))

    //--DROPDOWN ASSIGN TO-- assign to me btn
    const $assignBtnElm = $(`<a href="#" class="form-text text-muted link-info btn-assign">${$('#form_valid').attr('data-assign-txt')}</a>`)
    // $empElm.parents('.form-group').append($assignBtnElm)

    if ($empElm[0].closest('#formOpportunityTask')) {
        $empElm.parents('.form-group').append($assignBtnElm)
    }

    if (!$empElm[0].closest('#formOpportunityTask')) {
        $btnCreateTodo.each(function () {
            $(this).attr('hidden', true);
        });
        $('.sp-btn').each(function () {
            $(this).attr('hidden', true);
        });
        $('.desktop-btn').each(function () {
            $(this).attr('hidden', true);
        });
    }

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
        this.value = this.value.toLowerCase()
    })


    //--INPUT LABEL-- run init label function
    let formLabel = new labelHandle()
    formLabel.init()
    // public global scope for list page render when edit
    window.formLabel = formLabel

    //--DROPDOWN OPPORTUNITY-- autoload opp if in page opp
    if ($empElm[0].closest('#formOpportunityTask')) {
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
    }

    //--BTN LOG-TIME-- action click to log-work
    const $logWorkModal = $('#logWorkModal');
    $logWorkModal.on('hide.bs.modal', () => {
        $('#startDateLogTime')[0]._flatpickr.clear()
        $('#endDateLogTime')[0]._flatpickr.clear()
        $('#EstLogtime').val(null)
    })
    $('.btn-log_work').off().on('click', () => {
        $logWorkModal.modal('show')
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
        .then(newEditor => window.editor = newEditor) // public global scope for clean purpose when reset form

    // run checklist tab
    let checklist = new checklistHandle();
    checklist.init();
    // public global scope with name checklist
    window.checklist = checklist;

    // reset form create task khi click huỷ bỏ hoặc tạo mới task con
    oCanvas.on('hidden.bs.offcanvas', () => resetFormTask())

    $btnCreateTodo.on('click', function () {
        oCanvas.removeAttr('data-tbl-id');
        oCanvas.removeAttr('data-row-idx');
    });

    oCanvas.on('shown.bs.offcanvas', function () {
        // init S2 custom assignee
        if ($customAssignee.length > 0) {
            if (!$customAssignee.val()) {
                FormElementControl.loadInitS2($customAssignee, [], {}, oCanvas, true);
            }
        }
    });

    if ($empElm[0].closest('#formOpportunityTask')) {
        const {
            opp_id,
            opp_title,
            opp_code,
            process_id,
            process_title,
            process_stage_app_id,
            process_stage_app_title,
            inherit_id,
            inherit_title,
        } = $x.fn.getManyUrlParameters([
            'opp_id', 'opp_title', 'opp_code',
            'process_id', 'process_title',
            'process_stage_app_id', 'process_stage_app_title',
            'inherit_id', 'inherit_title',
        ])

        new $x.cls.bastionField({
            has_opp: true,
            has_inherit: true,
            has_process: true,
            has_prj: true,
            data_opp: $x.fn.checkUUID4(opp_id) ? [
                {
                    "id": opp_id,
                    "title": $x.fn.decodeURI(opp_title),
                    "code": $x.fn.decodeURI(opp_code),
                    "selected": true,
                }
            ] : [],
            data_process: $x.fn.checkUUID4(process_id) ? [
                {
                    "id": process_id,
                    "title": process_title,
                    "selected": true,
                }
            ] : [],
            data_process_stage_app: $x.fn.checkUUID4(process_stage_app_id) ? [
                {
                    "id": process_stage_app_id,
                    "title": process_stage_app_title,
                    "selected": true,
                }
            ] : [],
            data_inherit: $x.fn.checkUUID4(inherit_id) ? [
                {
                    "id": inherit_id,
                    "full_name": inherit_title,
                    "selected": true,
                }
            ] : [],
            "inheritFlagData": {"disabled": false, "readonly": false},
        }).init();
    }

    SetupFormSubmit.validate(
        $form,
        {
            submitHandler: function (form) {
                form.find('.create-task').attr('disabled', true)
                $btnCanvasLoad.show()
                let _form = new SetupFormSubmit(form);
                let formData = _form.dataForm
                const $assignerElm = $('#inputAssigner')

                if (formData.log_time === "") delete formData.log_time
                else {
                    let temp = formData.log_time.replaceAll("'", '"')
                    temp = JSON.parse(temp)
                    formData.log_time = temp
                }
                if (new Date(formData.end_date).getTime() < new Date(formData.start_date).getTime()) {
                    $.fn.notifyB({description: $('#form_valid').attr('data-valid-datetime')}, 'failure')
                    return false
                }

                formData.priority = parseInt(formData.priority)
                let tagsList = $('#inputLabel').attr('value')
                if (tagsList)
                    formData.label = JSON.parse(tagsList)
                formData.employee_created = $assignerElm.attr('value')
                const task_status = $sttElm.select2('data')[0]
                const taskSttData = {
                    'id': task_status.id,
                    'title': task_status.text,
                    'is_finish': task_status.is_finish
                }
                if (task_status.is_finish) formData.percent_completed = 100
                formData.percent_completed = parseInt(formData.percent_completed)

                if (!isValidString(formData.estimate)) {
                    $.fn.notifyB({description: $('#form_valid').attr('data-estimate-error')}, 'failure')
                    return false
                }

                let assign_toData = {};
                if ($empElm[0].closest('#formOpportunityTask')) {
                    const assign_to = $empElm.select2('data')[0]
                    // let assign_toData = {}
                    if (assign_to) {
                        assign_toData = {
                            'id': assign_to.id,
                            'full_name': assign_to.text,
                            'first_name': assign_to.first_name,
                            'last_name': assign_to.last_name,
                        }
                    }
                }

                if ($customAssignee.length > 0) {
                    let dataAssign = SelectDDControl.get_data_from_idx($customAssignee, $customAssignee.val());
                    assign_toData = {
                        'id': dataAssign?.['id'],
                        'full_name': dataAssign?.['full_name'],
                        'first_name': dataAssign?.['first_name'],
                        'last_name': dataAssign?.['last_name'],
                    }
                }

                formData.checklist = []
                $('.wrap-checklist .checklist_item').each(function () {
                    formData.checklist.push({
                        'name': $(this).find('label').text(),
                        'done': $(this).find('input').prop('checked'),
                    })
                })

                let opportunity_data = {};
                if ($empElm[0].closest('#formOpportunityTask')) {
                if (!formData.opportunity) delete formData.opportunity
                // let opportunity_data = {}
                if ($oppElm.val()) {
                    formData.opportunity = formData.opportunity_id = $oppElm.val()
                    opportunity_data = $oppElm.select2('data')[0]['data']
                }
                if (!formData.project) delete formData.project
                if ($prjElm.val()) formData.project = formData.project_id = $prjElm.val()

                }
                // case task extend to other apps
                if (!$empElm[0].closest('#formOpportunityTask')) {
                    opportunity_data = $oppElm.select2('data')[0]['data'];
                    formData['opportunity_data'] = $oppElm.select2('data')[0]['data'];
                }
                formData.attach = $x.cls.file.get_val(formData.attach, []);
                formData.attach_assignee = $x.cls.file.get_val(formData.attach_assignee, []);


                if (formData?.['assignee_group']) formData.group_assignee = formData['assignee_group']
                let method = 'POST'
                let url = form.attr('data-url')
                formData.id = $('input[name="id"]', form).val()
                if (formData.id && formData.id !== '') {
                    method = 'PUT'
                    url = $('#url-factory').attr('data-task-detail').format_url_with_uuid(formData.id)
                }
                $.fn.callAjax2({
                    'url': url,
                    'method': method,
                    'data': formData,
                    'sweetAlertOpts': {'allowOutsideClick': true},
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
                                    formData.employee_inherit = assign_toData
                                    formData.task_status = taskSttData
                                    formData.employee_created = {
                                        "id": $assignerElm.attr('value'),
                                        "full_name": $assignerElm.attr('data-name'),
                                        "first_name": $assignerElm.attr('data-name').split('. ')[1],
                                        "last_name": $assignerElm.attr('data-name').split('. ')[0],
                                    }
                                    formData.opportunity_data = opportunity_data
                                }
                                // case create
                                if (data?.id) formData = data
                                const datadump = JSON.stringify(formData)
                                elm.removeAttr('data-task').attr('data-task', datadump)
                                $('body').append(elm).trigger('From-Task.Submitted')

                                // handle logic for task extend to other apps
                                if (data?.['id'] && oCanvas.attr('data-tbl-id') && oCanvas.attr('data-row-idx')) {
                                    if (data?.['id']) {
                                        formData['id'] = data?.['id'];
                                    }
                                    let $table = $(`#${oCanvas.attr('data-tbl-id')}`);
                                    let rowIdx = oCanvas.attr('data-row-idx');
                                    let rowApi = $table.DataTable().row(rowIdx);
                                    let row = rowApi.node();
                                    let taskData = TaskExtend.storeData(formData, row);
                                    TaskExtend.renderTaskAvatarTblRow(taskData, row);
                                    // update data for row
                                    let rowIndex = $table.DataTable().row(row).index();
                                    let $row = $table.DataTable().row(rowIndex);
                                    let dataRow = $row.data();
                                    dataRow['task_data'] = taskData;
                                }
                                if (!data?.id && data?.status === 200) {
                                    let tasksDataEle = document.querySelectorAll('.table-row-task-data');
                                    if (tasksDataEle.length > 0) {
                                        for (let taskDataEle of tasksDataEle) {
                                            let target= false;
                                            if ($(taskDataEle).val()) {
                                                let taskData = JSON.parse($(taskDataEle).val());
                                                for (let task of taskData) {
                                                    if (task?.['id'] === formData?.['id']) {
                                                        task['percent_completed'] = formData?.['percent_completed'];
                                                        target = true;
                                                        break;
                                                    }
                                                }
                                                if (target === true) {
                                                    $(taskDataEle).val(JSON.stringify(taskData));
                                                    let row = taskDataEle.closest('tr');
                                                    if (row) {
                                                        let percentCompletedEle = row.querySelector('.table-row-percent-completed');
                                                        if (percentCompletedEle) {
                                                            let percent = TaskExtend.calculatePercentCompletedAll(taskData);
                                                            let badgeCls = 'bg-grey-light-4';
                                                            if (percent >= 50 && percent < 100) {
                                                                badgeCls = 'bg-blue-light-4';
                                                            }
                                                            if (percent >= 100) {
                                                                badgeCls = 'bg-green-light-4';
                                                            }
                                                            $(percentCompletedEle).html(`<span class="badge ${badgeCls} text-dark-10 fs-8">${String(percent) + ' %'}</span>`);
                                                        }
                                                    }
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            if ($('.current-create-task').length) $('.cancel-task').trigger('click')
                        }
                        // mở lại button tạo
                        $btnCanvasLoad.hide()
                        form.find('.create-task').attr('disabled', false)
                    },
                    (errs) => {
                        if (errs?.data?.errors)
                            $.fn.notifyB({'description': errs?.data?.errors}, 'failure')
                        form.find('.create-task').attr('disabled', false)
                        $btnCanvasLoad.hide()
                    }
                )
            }
        }
    )

});