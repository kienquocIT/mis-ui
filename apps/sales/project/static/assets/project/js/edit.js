$(document).ready(function(){
    'use strict';
    // run date-pick
    $('.date-picker').daterangepicker({
        singleDatePicker: true,
        timepicker: false,
        showDropdowns: false,
        minYear: 2023,
        autoApply: true,
        locale: {
            format: 'YYYY/MM/DD'
        },
        maxYear: parseInt(moment().format('YYYY'), 10),
    });

    // run select
    $('#selectEmployeeInherit, #select_project_owner, #select_project_group, #select_project_work').each(function(){
        $(this).initSelect2()
    });

    // init gantt
    const LEFT_TITLE = [
        {"code": 'title', "name": $.fn.gettext('Title'), width: 200},
        {"code": 'data_from', "name": $.fn.gettext('Date from'), width: 100},
        {"code": 'data_to', "name": $.fn.gettext('Date to'), width: 100},
        {"code": 'work_status', "name": $.fn.gettext('Work status'), width: 100},
    ]
    let currentDate = new Date()
    let start_D = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    let end_D = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

    var new_gantt = new Gantt(
        "#gantt",
        [
                    {
                        id: "11",
                        name: "Khảo sát thị trường",
                        start: "2023-07-16",
                        end: "2023-07-22",
                        progress: 0,
                        is_group: true,
                        is_toggle: true,
                        objData: {
                            id: "11",
                            title: "Khảo sát thị trường",
                            data_from: "2023-07-16",
                            data_to: "2023-07-22",
                            work_status: '',
                        }
                    },
                    {
                        id: "1",
                        name: "Draft the new contract document for sales team",
                        start: "2023-07-16",
                        end: "2023-07-20",
                        progress: 55,
                        child_of_group: true,
                        child_group_id: "11",
                        is_show: true,
                        objData: {
                            relationships_type: null,
                            id: "1",
                            title: "Draft the new contract document for sales team",
                            data_from: "2023-07-16",
                            data_to: "2023-07-20",
                            work_status: 'to do',
                        }
                    },
                    {
                        id: "2",
                        name: "Find out the old contract documents",
                        start: "2023-07-19",
                        end: "2023-07-21",
                        progress: 85,
                        dependencies: "1",
                        child_of_group: true,
                        child_group_id: "11",
                        is_show: true,
                        objData: {
                            relationships_type: 0,
                            id: "2",
                            title: "Find out the old contract documents",
                            data_from: "2023-07-19",
                            data_to: "2023-07-21",
                            work_status: 'pedding',
                            dependencies: "1",
                        }
                    },
                    {
                        id: "3",
                        name: "Organize meeting with sales associates to understand need in detail",
                        start: "2023-07-22",
                        end: "2023-07-23",
                        progress: 80,
                        dependencies: "2",
                        child_of_group: true,
                        child_group_id: "11",
                        is_show: true,
                        objData: {
                            relationships_type: 1,
                            id: "3",
                            title: "Organize meeting with sales associates to understand need in detail",
                            data_from: "2023-07-21",
                            data_to: "2023-07-22",
                            work_status: 'in progress',
                            dependencies: "2",
                        }
                    },
                    {
                        id: "4",
                        name: "iOS App home page",
                        start: "2023-07-15",
                        end: "2023-07-17",
                        progress: 80,
                        objData: {
                            relationships_type: null,
                            id: "4",
                            title: "iOS App home page",
                            data_from: "2023-07-15",
                            data_to: "2023-07-17",
                            work_status: 'completed'
                        }
                    },
                    {
                        id: "5",
                        name: "Write a release note",
                        start: "2023-07-18",
                        end: "2023-07-22",
                        progress: 65,
                        dependencies: "4",
                        objData: {
                            id: "5",
                            title: "Write a release note",
                            data_from: "2023-07-18",
                            data_to: "2023-07-22",
                            work_status: 'inital',
                            dependencies: "4"
                        }
                    },
                    {
                        id: "6",
                        name: "Write a release note l2",
                        start: "2023-07-18",
                        end: "2023-07-22",
                        progress: 55,
                        dependencies: "5",
                        objData: {
                            id: "6",
                            title: "Write a release note 2",
                            data_from: "2023-07-18",
                            data_to: "2023-07-22",
                            work_status: 'inital',
                            dependencies: "5"
                        }
                    }
                ],
        {
            view_modes: ["Quarter Day", "Half Day", "Day", "Week", "Month", "Year"],
            bar_height: 20,
            padding: 18,
            view_mode: "Week",
            custom_popup_html: null,
            left_list: LEFT_TITLE,
            disable_on_click: true,
            gantt_start: start_D,
            gantt_end: new Date(end_D.getTime() - 1),
            init_create_btn: fGanttCustom.setup_init_create
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
                $('#dateStart').val(moment(data.start_date).format('YYYY/MM/DD'))
                $('#dateFinish').val(moment(data.finish_date).format('YYYY/MM/DD'))
                fGanttCustom.convert_data(data['groups'], data['works'])
            },
            (err) => $.fn.notifyB({description: err.data.errors}, 'failure')
        )
});