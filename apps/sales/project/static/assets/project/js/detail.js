$(document).ready(function () {
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
            is_detail: true
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
                $x.fn.renderCodeBreadcrumb(data);
                $('#titleInput').val(data.title)
                $('#id').val(data.id)
                let opt1 = new Option(data['project_owner']['full_name'], data['project_owner']['id'], true, true);
                $('#select_project_owner').attr('data-onload', JSON.stringify(data['project_owner'])).append(opt1).trigger('change');
                let opt2 = new Option(data['employee_inherit']['full_name'], data['employee_inherit']['id'], true, true);
                $('#selectEmployeeInherit').attr('data-onload', JSON.stringify(data['employee_inherit'])).append(opt2).trigger('change');
                $('#dateStart').val(moment(data.start_date).format('DD/MM/YYYY'))
                $('#dateFinish').val(moment(data.finish_date).format('DD/MM/YYYY'))
                const afterData = fGanttCustom.convert_data(data['groups'], data['works'])
                new_gantt.load_more(afterData)
                ProjectTeamsHandle.render(data.members, true)
                $('.gaw-btn').addClass('hidden')
                Task_in_project.init(data)
                ProjectWorkExpenseHandle.init(data?.['works'])
            },
            (err) => $.fn.notifyB({description: err.data.errors}, 'failure')
        )
});