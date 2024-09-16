$(document).ready(function () {
    'use strict';
    // run date-pick
    $('.date-picker').daterangepicker({
        singleDatePicker: true,
        timepicker: false,
        showDropdowns: false,
        minYear: 2023,
        autoApply: true,
        locale: {
            format: 'DD/MM/YYYY'
        },
        maxYear: parseInt(moment().format('YYYY'), 10),
    });

    // run select employee choice
    $('#selectEmployeeInherit, #select_project_pm').each(function () {
        $(this).initSelect2({
            templateResult: function (state) {
                let groupHTML = `<span class="badge badge-soft-primary">${state.data?.group?.title ? state.data.group.title : "_"}</span>`
                let activeHTML = state.data?.is_active === true ? `<span class="badge badge-success badge-indicator"></span>` : `<span class="badge badge-light badge-indicator"></span>`;
                return $(`<span>${state.text} ${activeHTML} ${groupHTML}</span>`);
            },
        })
    });
    $('#select_project_group, #select_project_work').each(function () {
        $(this).initSelect2()
    });

    // init gantt
    const LEFT_TITLE = [
        {"code": 'title', "name": $.fn.gettext('Title'), width: 300},
        {"code": 'weight', "name": $.fn.gettext('Weight'), width: 100},
        {"code": 'progress', "name": $.fn.gettext('Rate'), width: 50},
        {"code": 'start', "name": $.fn.gettext('Date from'), width: 100},
        {"code": 'end', "name": $.fn.gettext('Date to'), width: 100},
        {"code": 'work_status', "name": $.fn.gettext('Work status'), width: 180},
    ]
    let currentDate = new Date()
    let start_D = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    let end_D = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

    // xử lý chart và request change date
    // Tạo một hàng đợi để lưu trữ các request AJAX
    let ajaxQueue = [];

    function enqueueAjaxRequest(request) {
        $('.lazy_loading').addClass('active')
        let ajax_request = {
            'url': $('#url-factory').attr('data-work-detail').format_url_with_uuid(request.id),
            'method': 'put',
            'data': request,
            'sweetAlertOpts': {'allowOutsideClick': true},
        }
        ajaxQueue.push(ajax_request);
        processQueue();
    }

    // Hàm để xử lý hàng đợi
    function processQueue() {
        if (ajaxQueue.length > 0) {
            // Lấy request đầu tiên trong hàng đợi
            let request = ajaxQueue.shift();

            // Thực hiện request
            $.fn.callAjax2(request).then(
                (resp) => {
                    let res = $.fn.switcherResp(resp);
                    if (res && (res['status'] === 201 || res['status'] === 200)) {
                        $.fn.notifyB({description: res.message}, 'success');
                        processQueue();
                    }
                },
                (err) => {
                    $.fn.notifyB({description: err.data.errors}, 'failure')
                    $('.lazy_loading').removeClass('active')
                }
            )
        } else $('.lazy_loading').removeClass('active')
    }

    var new_gantt = new Gantt(
        "#gantt",
        [],
        {
            view_modes: ["Quarter Day", "Half Day", "Day", "Week", "Month", "Year"],
            bar_height: 20,
            padding: 18,
            view_mode: "Day",
            custom_popup_html: null,
            left_list: LEFT_TITLE,
            disable_on_click: true,
            gantt_start: start_D,
            gantt_end: new Date(end_D.getTime() - 1),
            init_create_btn: fGanttCustom.setup_init_create,
            init_edit_btn_g: fGanttCustom.load_detail_group,
            init_edit_btn_w: fGanttCustom.load_detail_work,
            delete_row_func: fGanttCustom.delete_row,
            on_date_change: function (task, start, end) {
                let opt = {
                    id: task.id,
                    w_start_date: moment(start).format('YYYY-MM-DD'),
                    w_end_date: moment(end).format('YYYY-MM-DD'),
                    project: $('#id').val(),
                    w_weight: task.weight
                }
                if (task?.['child_of_group']) opt.group = task['child_group_id']
                enqueueAjaxRequest(opt)
            }
        }
    );

    // get data
    let $form = $('#project_form')
    $.fn.callAjax2({
        'url': $form.attr('data-url-detail'),
        'method': 'get',
    })
        .then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data.system_status > 2) window.location.href = $('#url-factory').attr('data-list');
                WFRTControl.setWFRuntimeID(data['workflow_runtime_id']);
                $x.fn.renderCodeBreadcrumb(data);
                $('#titleInput').val(data.title)
                $('#id').val(data.id)
                let opt1 = new Option(data['project_pm']['full_name'], data['project_pm']['id'], true, true);
                $('#select_project_pm').attr('data-onload', JSON.stringify(data['project_pm'])).append(opt1).trigger('change');
                $('#employeeInheritInput').attr('data-value', data['employee_inherit'].id).val(data['employee_inherit'].full_name);
                $('#dateStart').val(moment(data.start_date).format('DD/MM/YYYY'))
                $('#dateFinish').val(moment(data.finish_date).format('DD/MM/YYYY'))

                const afterData = fGanttCustom.convert_data(data.groups, data?.['works'])
                new_gantt.load_more(afterData)
                ProjectTeamsHandle.render(data.members)
                Task_in_project.init(data)
                ProjectWorkExpenseHandle.init(data?.['works'])
                const _crtEmpID = JSON.parse($('#current_info').text()).id
                if (data['employee_inherit']['id'] === _crtEmpID || data['project_pm']['id'] === _crtEmpID) {
                    $('#create_baseline').prop('disabled', false)
                    $('#data_form').data('form_data', data)
                }
                else $('#create_baseline').prop('disabled', true)
                WFRTControl.setWFInitialData('projectbaseline', 'post');
                animating_number(data['completion_rate'], $('.completion_rate_block .heading span'))
                if (data['completion_rate'] !== 100)
                    $('#complete_project span span:nth-child(2)').text($.fn.gettext('Close Project'))


                new $x.cls.file($('#project_assign_attach')).init({
                    enable_edit: false,
                    enable_download: true,
                    data: data['assignee_attachment'],
                })
            },
            (err) => $.fn.notifyB({description: err.data.errors}, 'failure')
        )

    // run click add group btn
    saveGroup(new_gantt)
    saveWork(new_gantt)
    show_task_list()

    // validate form
    let $TaskFrom = $('#formOpportunityTask');
    SetupFormSubmit.validate($TaskFrom, {
        errorClass: 'is-invalid cl-red',
        submitHandler: TaskSubmitFunc
    })

    // run load employee list
    ProjectTeamsHandle.init()

    // handle modal employee show
    $('#modal_employee_list').on('show.bs.modal', function () {
        let $tblUser = $('#dtbMember');
        let tblData = $tblUser.DataTable().data().toArray();
        for (let data of tblData) {
            if (ProjectTeamsHandle.crt_user.includes(data.id)) data['is_checked_new'] = true
        }
        $tblUser.DataTable().clear().rows.add(tblData).draw();
    });

    // delete user member
    $(document).on('card.action.close.confirm', '.member-item .card', function () {
        let eleCard = $(this);
        $.fn.callAjax2({
            url: $('#url-factory').attr('data-member-delete').format_url_with_uuid(eleCard.attr('data-id')),
            method: 'DELETE',
            'sweetAlertOpts': {
                'allowOutsideClick': true
            }
        }).then(
            (resp) => {
                $.fn.switcherResp(resp);
                $.fn.notifyB({
                    'description': $.fn.transEle.data('success'),
                }, 'success');
                $(this).trigger('card.action.close.purge');
            },
            (errs) => {
                $.fn.notifyB({
                    'description': $.fn.transEle.data('fail') + ": " + $('#trans-factory').attr('data-msg-deny-delete-member-owner'),
                }, 'failure');
                $(this).trigger('card.action.close.show');
            }
        )
    })

    // run create btn
    createBaseline.init()

    // change gantt view mode
    $('#change_view_mode button').on('click', function(){
        $('#change_view_mode button').removeClass('active')
        $(this).addClass('active')
        let mode = $(this).attr('data-value')
        new_gantt.change_view_mode(mode)
    })

    if (typeof dragElement === "function")
        $('.init_drag_modal').each(function(){
            dragElement($(this)[0])
        })
});