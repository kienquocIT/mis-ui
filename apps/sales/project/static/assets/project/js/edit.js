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
            format: 'DD/MM/YYYY'
        },
        maxYear: parseInt(moment().format('YYYY'), 10),
    });

    // run select employee choise
    $('#selectEmployeeInherit, #select_project_owner').each(function(){
        $(this).initSelect2({
            templateResult: function (state) {
                let groupHTML = `<span class="badge badge-soft-primary">${state.data?.group?.title ? state.data.group.title : "_"}</span>`
                let activeHTML = state.data?.is_active === true ? `<span class="badge badge-success badge-indicator"></span>` : `<span class="badge badge-light badge-indicator"></span>`;
                return $(`<span>${state.text} ${activeHTML} ${groupHTML}</span>`);
            },
        })
    });
    $('#select_project_group, #select_project_work').each(function(){
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
                ProjectTeamsHandle.render(data.members)
                Task_in_project.init(data)
            },
            (err) => $.fn.notifyB({description: err.data.errors}, 'failure')
        )

    // run click add group btn
    saveGroup(new_gantt)
    saveWork(new_gantt)
    show_task_list()

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

});