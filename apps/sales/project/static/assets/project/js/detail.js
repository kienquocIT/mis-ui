$(document).ready(function () {
    // init gantt
    const LEFT_TITLE = [
        {"code": 'title', "name": $.fn.gettext('Title'), width: 300},
        {"code": 'weight', "name": $.fn.gettext('Weight'), width: 100},
        {"code": 'progress', "name": $.fn.gettext('Rate'), width: 50},
        {"code": 'start', "name": $.fn.gettext('Date from'), width: 100},
        {"code": 'end', "name": $.fn.gettext('Date to'), width: 100},
        {"code": 'work_status', "name": $.fn.gettext('Work status'), width: 180},
    ], $form = $('#project_form');
    let currentDate = new Date()
    let start_D = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    let end_D = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    const check_page_version = $form.hasClass('baseline_version');
    let opt = {
            view_modes: ["Quarter Day", "Half Day", "Day", "Week", "Month", "Year"],
            bar_height: 20,
            padding: 18,
            view_mode: "Day",
            custom_popup_html: null,
            left_list: LEFT_TITLE,
            disable_on_click: true,
            gantt_start: start_D,
            gantt_end: new Date(end_D.getTime() - 1),
            is_detail: false,
        };

    if (check_page_version){
        opt.init_edit_btn_w = fGanttCustom.load_detail_work
        opt.init_edit_btn_g = fGanttCustom.load_detail_group
        // hidden delete employee member tab
        $('.wrap_members .member-item .card-action-wrap .card-action-close').addClass('disabled')
    }

    var new_gantt = new Gantt(
        "#gantt",
        [],
        opt
    );

    // get data
    $.fn.callAjax2({
            'url': $form.attr('data-url-detail'),
            'method': 'get',
        })
        .then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                $x.fn.renderCodeBreadcrumb(data);
                let project = data
                $('#data_form').data('form_data', data)
                if ($form.hasClass('baseline_version')){
                    project = data.project_data
                    $form.data('baseline_data', data)
                }
                $('#titleInput').val(project.title)
                $('#id').val(project.id)
                let opt1 = new Option(project['project_pm']['full_name'], project['project_pm']['id'], true, true);
                $('#select_project_pm').attr('data-onload', JSON.stringify(project['project_pm'])).append(opt1).trigger('change');
                $('#employeeInheritInput').attr('data-value', project['employee_inherit'].id).val(project['employee_inherit'].full_name);
                $('#dateStart').val(moment(project.start_date).format('DD/MM/YYYY'))
                $('#dateFinish').val(moment(project.finish_date).format('DD/MM/YYYY'))
                if(project['date_close'])
                    $('#dateClose').val(moment(project['date_close']).format('DD/MM/YYYY'))
                        .closest('.form-group').removeClass('hidden')

                let group = [], work = [];
                if ($form.hasClass('baseline_version')){
                    group = project['group']
                    work = project['work']
                }
                else{
                    group = project['groups']
                    work = project['works']
                }
                const afterData = fGanttCustom.convert_data(group, work);
                new_gantt.load_more(afterData)
                ProjectTeamsHandle.render(project.members, true)
                $('.gaw-btn').addClass('hidden')
                Task_in_project.init(project)
                ProjectWorkExpenseHandle.init(work)
                animating_number(project['completion_rate'], $('.completion_rate_block .heading span'))
                if (data['completion_rate'] !== 100)
                    $('#complete_project span span:nth-child(2)').text($.fn.gettext('Close Project'))
                if (project.system_status <= 2)
                    $('.btn-edit-page, #create_baseline').prop('hidden', false)
                else{
                    $('#open_project').prop('hidden', false)
                    $('#complete_project').prop('hidden', true)
                }
                new $x.cls.file($('#project_assign_attach')).init({
                    enable_edit: false,
                    data: project['assignee_attachment'],
                })
            },
            (err) => $.fn.notifyB({description: err.data.errors}, 'failure')
        )

    // init open task list in work
    show_task_list()

    // create baseline
    createBaseline.init()
});