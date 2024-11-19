$(document).ready(function () {

    //--INPUT LABEL-- run init label function
    let formLabel = new labelHandle()
    formLabel.init()
    window.formLabel = formLabel

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

    const cls_tasks = new handle_tasks_cls();
    cls_tasks.init();
});

class handle_tasks_cls {
    constructor() {
        this.$table = $('#table_task_list');
    }

    resetFormTask() {
        // clean html select etc.
        $('#formOpportunityTask').trigger('reset').removeClass('task_edit')
        $('#employee_inherit_id').val('').trigger('change').prop('disabled', false).removeClass('is-invalid');
        $('#employee_inherit_id-error').remove()
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
        $('.create-task').attr('disabled', false);
        const $attachElm = $('#assigner_attachment'), $attachElmAssignee = $('#assignee_attachment');
        $attachElm.find('.dm-uploader').dmUploader("reset")
        $attachElm.find('.dm-uploader-result-list').html('');
        $attachElm.find('.dm-uploader-no-files').css({'display': 'block'});

        $attachElmAssignee.find('.dm-uploader').dmUploader("reset")
        $attachElmAssignee.find('.dm-uploader-result-list').html('');
        $attachElmAssignee.find('.dm-uploader-no-files').css({'display': 'block'});
    }

    renderTable(){
        const priority_list = {
            0: 'success',
            1: 'warning',
            2: 'danger'
        }
        const $table = this.$table;
        const _this = this;
        if ($table.hasClass('dataTable'))
            $table.DataTable().ajax.reload()
        else
            $table.DataTableDefault({
                useDataServer: true,
                ajax: {
                    url: $('#url-factory').attr('data-task-list'),
                    type: 'get',
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        let res = []
                        if (data) {
                            let temp = resp.data['prj_task_list_all'] ? resp.data['prj_task_list_all'] : [];
                            if (temp)
                                res = temp.map((item) => item.task)
                        }
                        return res;
                    },
                    data: function (params) {
                        let txtSearch = $('#table_task_list_filter input[type="search"]').val();
                        if (txtSearch.length > 0)
                            params['search'] = txtSearch
                        params['project_id'] = $('#filter_project_id').val() || ''
                        params['task_status'] = $('#filter_task_status').val() || ''
                        params['employee_inherit'] = $('#filter_employee_id').val() || ''
                        params['is_ajax'] = true;
                        return params
                    },
                    error: function (jqXHR) {
                        $table.find('.dataTables_empty').text(jqXHR.responseJSON.data.errors)
                    }
                },
                pageLength: 50,
                columns: [
                    {
                        "data": 'title',
                        render: (row, type, data) => {
                            return `<span class="mr-2">${row ? row : "_"}</span>` +
                                '<span class="badge badge-primary badge-indicator-processing badge-indicator" style="margin-top: -1px;"></span>'
                                + `<span class="ml-2 font-weight-bold mr-2">${data.code}</span>`
                                + `<label class="card-ticket" title="${$.fn.gettext('Percent completed')}">
                                        <span>${data['percent_completed']}</span>%</label>`
                        }
                    },
                    {
                        "data": 'priority',
                        render: (row) => {
                            let $badge = $($('.priority-badges').html());
                            $badge.find('.badge-icon-wrap').text(
                                row === 0 ? '!' : row === 1 ? '!!' : '!!!'
                            )
                            $badge.addClass(`text-${priority_list[row]}`)
                            return $badge.prop('outerHTML')
                        }
                    },
                    {
                        "data": "task_status",
                        "class": "w-15",
                        render: (row) => {
                            const config = JSON.parse($('#task_config').text())
                            let html = $('<span class="badge text-dark font-2">')
                            for (let cf of config.list_status) {
                                if (cf.id === row.id) {
                                    html.css('background-color', cf.task_color).text(row.title)
                                    break;
                                }
                            }
                            return html.prop('outerHTML')
                        }
                    },
                    {
                        "data": "employee_inherit",
                        "class": "col-2 text-right",
                        render: (row, type, data) => {
                            let html = ''
                            if (!data.employee_created?.full_name)
                                data.employee_created.full_name = data.employee_created.last_name +
                                    ' ' + data.employee_created.first_name
                            const assigner = $x.fn.renderAvatar(data.employee_created).replace(
                                'avatar-primary', 'avatar-' + $x.fn.randomColor())
                            let assignee = ''
                            if (row) {
                                if (!row.full_name) row.full_name = row.last_name + ' ' + row.first_name
                                assignee = $x.fn.renderAvatar(row).replace(
                                    'avatar-primary', 'avatar-soft-' + $x.fn.randomColor())
                            }
                            html += assigner + '<supper>»</supper>' + assignee
                            return html
                        }
                    },
                    {
                        "data": "date_created",
                        "class": "col-1",
                        render: (row, type, data) => {
                            if (!row) row = new Date()
                            return `<span>${$x.fn.parseDate(row)}<span>`
                        }
                    },
                    {
                        "data": "project",
                        "class": "col-1",
                        render: (row) => {
                            let html = '--';
                            if (row?.code) html = `<span>${row.code}</span>`
                            return html
                        }
                    },
                    {
                        "class": "col-1 text-center",
                        render: (row, type, data) => {
                            const isEdit = data?.edited ? data.edited : false;
                            let $btn = $('<div><button class="btn btn_task-list-action btn-icon btn-rounded bg-dark-hover" type="button"></button></div>')
                            $btn.find('button').html(`<span class="icon"><i class="fa-regular ${isEdit ? 'fa-eye' : 'fa-eye-slash'}"></i></span>`)
                            $btn.append(`<div class="list_act-wrap">${
                                $('.card-child_template .card-action-wrap').html()}</div>`)
                            return $btn.prop('outerHTML')
                        }
                    }
                ],
                rowCallback: (row, data, index) => {
                    $('.avatar', row).tooltip({placement: 'top'})
                    // click view task list
                    $('.btn_task-list-action', row).off().on('click', function () {
                        _this.showSideBar(row, data, index)
                    })
                    // click delete
                    $('.del-task-act', row).off().on('click', function () {
                        const task_delete = _this.deleteTask(data.id)
                        task_delete.then((req) => {
                            let res = $.fn.switcherResp(req);
                            if (res?.['status'] === 200) {
                                $table.DataTable().row(row).remove().draw(false)
                            }
                        })
                    })
                    // click logwork
                    $('.log-task-act', row).off().on('click', function () {
                        const elmTaskID = $('#logtime_task_id')
                        $('#startDateLogTime, #endDateLogTime, #EstLogtime').val(null)
                        $($(this).attr('href')).modal('show')
                        elmTaskID.val(data.id)
                        logworkSubmit()
                    })
                }
            }).on('draw.dt', function () {
                $table.find('tbody').find('tr').each(function () {
                    $(this).after('<tr class="table-row-gap"><td></td></tr>');
                });
            });
    }

    initSelect(elm, data, key='title'){
        data = {...data, selected: true}
        elm.attr('data-onload', JSON.stringify(data)).removeClass('is-valid')
        elm.parents('.form-group').removeClass('has-error').find('small.is-invalid').remove()
        if ($(`option[value="${data.id}"]`, elm).length <= 0)
            elm.html('').append(`<option value="${data.id}">${data[key]}</option>`)
        elm.initSelect2()
    }

    initTaskLogWork(dataList){
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

    renderSubTask(taskID, dataSub){
        const $wrap = $('.wrap-subtask')
        let subTaskList = dataSub
        const _this = this
        const dataList = $('#table_task_list').DataTable().data().toArray()
        $wrap.html('')
        if (subTaskList.length) {
            for (let [key, item] of subTaskList.entries()) {
                const template = $(`<div class="d-flex justify-content-start align-items-center subtask_item">
                                    <p class="sub-tit" title="${item.title}">${item.title}</p>
                                    <p class="sub-employee" title="${item.employee_inherit}"><span class="chip chip-primary chip-pill"><span class="chip-text">${item.employee_inherit}</span></span></p>
                                    <button class="btn btn-flush-primary btn-icon btn-rounded ml-auto flush-soft-hover">
                                        <span><i class="fa-regular fa-trash-can fa-sm"></i></span>
                                    </button>
                                 </div>`);
                $wrap.append(template);
                const subTaskID = item.id
                template.find('button').off().on('click', function () {
                    const _isDelete = _this.deleteTask(subTaskID)
                    _isDelete.then((req) => {
                        let res = $.fn.switcherResp(req);
                        if (res?.['status'] === 200) {
                            //remove html in form
                            template.remove();
                            for (let val of dataList){
                                if (val.id === subTaskID){
                                    $('#table_task_list').DataTable().ajax.reload();
                                    break;
                                }
                            }

                        }
                    })
                })
            }
        }
    }

    deleteTask(taskID) {
        return $.fn.callAjax2({
            'url': $('#url-factory').attr('data-task-detail').format_url_with_uuid(taskID),
            'method': 'DELETE',
            'sweetAlertOpts': {
                'allowOutsideClick': true,
                'showCancelButton': true
            }
        })
    }

    showSideBar(row, data, idx){
        let tbl = $('#table_task_list');
        const _this = this;
        const edit_elm = $(row).find('.btn_task-list-action i')
        const is_edit = edit_elm.hasClass('fa-eye')
        if (is_edit) {
            // off eyes icon of row
            $('.cancel-task').trigger('click')
            edit_elm.removeClass('fa-eye').addClass('fa-eye-slash')
        } else {
            if (!$('.hk-wrapper').hasClass('open'))
                $('[data-drawer-target="#drawer_task_create"]').trigger('click')
            else{
                // case click task khác mà chưa đóng task cũ
                tbl.find('.btn_task-list-action i').removeClass('fa-eye').addClass('fa-eye-slash')
            }
            edit_elm.removeClass('fa-eye-slash').addClass('fa-eye')
            // call ajax detail task
            $.fn.callAjax2({
                "url": $('#url-factory').attr('data-task-detail').format_url_with_uuid(data.id),
                "method": "get"
            }).then(
                (req) => {
                    const data = $.fn.switcherResp(req);
                    const $form = $('#formOpportunityTask');
                    if (data.status === 200) {
                        $('#inputTextTitle', $form).val(data.title)
                        $('#inputTextCode', $form).val(data.code)
                        _this.initSelect($('#selectStatus', $form), data.task_status)
                        const taskIDElm = $(`<input type="hidden" name="id" value="${data.id}"/>`)
                        $form.append(taskIDElm).addClass('task_edit')
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

                        _this.initSelect($('#employee_inherit_id', $form), data.employee_inherit, 'full_name')
                        _this.initSelect($('#project_id', $form), data.project, 'title')
                        _this.initSelect($('#process_id', $form), data.process, 'title')
                        window.formLabel.renderLabel(data.label)
                        window.editor.setData(data.remark)
                        window.checklist.setDataList = data.checklist
                        window.checklist.render()

                        $form.addClass('task_edit')
                        if (data.attach) {
                            let $elmAttAssign = $('#assigner_attachment'),
                                $elmAttachAssignee = $('#assignee_attachment'),
                                _lstAssigner = [],
                                _lstAssignee = [];
                            for (let item of data.attach) {
                                if (item['is_assignee_file'] === true) _lstAssignee.push(item)
                                else _lstAssigner.push(item)
                            }
                            // load attachments of assigner
                            $elmAttAssign.find('.dm-uploader').dmUploader("destroy")
                            new $x.cls.file(
                                $elmAttAssign
                            ).init({
                                enable_edit: true,
                                data: _lstAssigner,
                            })

                            // load attachment if assignee
                            $elmAttachAssignee.find('.dm-uploader').dmUploader("destroy")
                            new $x.cls.file(
                                $elmAttachAssignee
                            ).init({
                                enable_edit: true,
                                data: _lstAssignee,
                            })
                        }
                        _this.initTaskLogWork(data?.['task_log_work'])
                        _this.renderSubTask(data.id, data?.['sub_task_list'])
                        $('.txt-create').addClass('hidden')
                        $('.txt-update').removeClass('hidden')
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure')
                }
            )
        }
    }

    init() {
        // first time load get and render data
        this.renderTable();
        const _this = this;
        // reset form create task khi click huỷ bỏ
        $('.cancel-task, [data-drawer-target="#drawer_task_create"]').each((idx, elm) => {
            $(elm).on('click', function () {
                if ($(this).hasClass('cancel-task')) {
                    $(this).closest('.ntt-drawer').toggleClass('open');
                    $('.hk-wrapper').toggleClass('open');
                }
                const titCreate = $('.title-create'), titEdit = $('.title-detail');
                if (titCreate.hasClass('hidden')) titCreate.removeClass("hidden")
                if (!titEdit.hasClass('hidden')) titEdit.addClass("hidden")
                _this.resetFormTask()
            });
        });

        // init attachment file
        new $x.cls.file($('#assigner_attachment')).init({'name': 'attach'});
        new $x.cls.file($('#assignee_attachment')).init({'name': 'attach_assignee'});

        //--BTN LOG-TIME-- action click to log-work
        $('#startDateLogTime, #endDateLogTime').daterangepicker({
            singleDatePicker: true,
            timepicker: false,
            showDropdowns: false,
            minYear: 2023,
            locale: {
                format: 'DD/MM/YYYY',
            },
            maxYear: parseInt(moment().format('YYYY'), 10),
            autoApply: true
        });
        $('.btn-log_work').off().on('click', () => {
            $('#logWorkModal').modal('show')
            $('#startDateLogTime, #endDateLogTime, #EstLogtime').val(null)
            const taskID = $('.task_edit [name="id"]').val()
            if (taskID) $('#logtime_task_id').val(taskID)
            logworkSubmit()
        })

        // init select prj
        let $prj = $('#filter_project_id');
        const config = JSON.parse($('#task_config').text());
        let $stt = $('#filter_task_status')
        let elmTable = $('#table_task_list')
        let $empElm = $('#filter_employee_id')
        const clrBtn = $('.clear-all-btn')

        $prj.initSelect2().on('select2:select', function(e){
            elmTable.DataTable().ajax.reload()
            if (e.params.data.data)
                clrBtn.removeClass('hidden')
        });

        for (let item of config?.['list_status']){
            $stt.append(`<option value="${item.id}">${item.name}</option>`)
        }
        $stt.on('change', function(){
            elmTable.DataTable().ajax.reload()
            if (this.value)
                clrBtn.removeClass('hidden')
        })

        $empElm.initSelect2().on('select2:select', function(e){
            elmTable.DataTable().ajax.reload()
            if (e.params.data.data)
                clrBtn.removeClass('hidden')
        })

        clrBtn.on('click', function(){
            $(this).addClass('hidden')
            $prj.val('').trigger('change')
            $stt.val('')
            $empElm.val('').trigger('change')
            elmTable.DataTable().ajax.reload()
        });

        $('#formOpportunityTask').find('.custom-layout .accordion-item .accordion-body .row:last-child > div')
            .removeClass('col-lg-4 col-md-4 col-sm-6 col-12').addClass('col-xs-12')
    }
}
